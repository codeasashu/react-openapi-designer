import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {useDispatch} from 'react-redux';
import {
  addComponent,
  addPath,
  renameComponent,
  handlePathNameChange,
} from '../store/modules/openapi';
//import Tree from './Common/TreeList/Tree';
import Tree from './Tree/List';
import {isValidPathMethod} from '../utils';
//import set from 'lodash.set';
import {invert, cloneDeep} from 'lodash';
import {handleModelDelete} from '../redux/modules/openapi';
import VTree from '../Tree/Tree';
import ComputableTree from '../Tree/computedTree';
import TreeStore from '../Tree/Store';
import TreeState from '../Tree/State';
import {Resolve} from '../Tree/Resolver';
import TreeOrder from '../Tree/Order';
import {generateUUID} from '../utils/tree';
import {icons} from '../model';

const Title = (props) => {
  return (
    <div className={'flex items-center'}>
      <div
        className={
          'flex-1 px-4 py-2 truncate select-none text-gray-6 dark:text-gray-3'
        }>
        {props.text}
      </div>
    </div>
  );
};

Title.propTypes = {
  text: PropTypes.string,
};

const nodeTypes = {
  paths: 'path',
  models: 'model',
  responses: 'response',
  parameters: 'parameter',
  examples: 'example',
};

const getChildType = (nodeType, inverted = false) => {
  const nodeMap = inverted ? invert(nodeTypes) : nodeTypes;
  if (Object.keys(nodeMap).indexOf(nodeType) >= 0) {
    return nodeMap[nodeType];
  }
  return null;
};

const Sidebar = ({openapi, onClick}) => {
  const dispatch = useDispatch();

  const rootNode = VTree.createArtificialRoot();
  const tree = new ComputableTree(Resolve, {order: TreeOrder}, rootNode);
  const treeStore = new TreeStore(tree, new TreeState(), {
    defaultExpandedDepth: 1,
    icons,
  });

  treeStore.create({}, rootNode);
  treeStore.create(
    {
      id: generateUUID(),
      _name: 'Users',
      type: 'model',
    },
    treeStore.tree._root.children[2],
  );
  console.log('tree', tree);
  console.log('tree2', treeStore.tree._root.children[2]);

  const handleUndo = (node) => {
    const parentType = getChildType(node.type, true);
    const treeDataCopy = cloneDeep(treeData);
    console.log('newTreeData', treeData, treeDataCopy);
    treeDataCopy
      .filter((i) => i.type === parentType)
      .map((p) => {
        const index = p.children.findIndex((j) => j.type === node.type);
        if (index >= 0) {
          p.children[index].isEdited = false;
        }
        return p;
      });

    const modified = treeDataCopy.map((item) => ({
      ...item,
      expanded: treeData.find((i) => i.type === item.type).expanded,
    }));

    console.log('newTreeData', treeData, modified, treeDataCopy);
    setTreeData(modified);
  };

  const getTreeData = (spec) => {
    return [
      {
        name: 'API Overview',
        type: 'overview',
      },
      {
        type: 'paths',
        name: 'Paths',
        children: Object.keys(spec.paths).map((p) => ({
          name: p,
          type: 'path',
          actions: {
            rename: (newPath) => {
              dispatch(
                handlePathNameChange({
                  newPath,
                  oldPath: p,
                }),
              );
            },
            undo: handleUndo,
          },
          metadata: {
            operations: {
              items: Object.keys(spec.paths[p])
                .filter(isValidPathMethod)
                .map((m) => ({
                  method: m.toLowerCase(),
                })),
            },
          },
        })),
      },
      {
        type: 'models',
        name: 'Models',
        children: Object.keys(spec.components.schemas).map((s) => ({
          type: 'model',
          name: s,
          actions: {
            undo: handleUndo,
            rename: (name) => {
              dispatch(
                renameComponent({
                  parentName: 'schemas',
                  name,
                  oldName: s,
                }),
              );
            },
          },
        })),
      },
      {
        type: 'responses',
        name: 'Responses',
        children: Object.keys(spec.components.responses).map((s) => ({
          type: 'response',
          name: s,
          actions: {
            undo: handleUndo,
            rename: (name) => {
              dispatch(
                renameComponent({
                  parentName: 'responses',
                  name,
                  oldName: s,
                }),
              );
            },
          },
        })),
      },
      {
        type: 'parameters',
        name: 'Parameters',
        children: Object.keys(spec.components.parameters).map((s) => ({
          type: 'parameter',
          name: s,
          actions: {
            undo: (node) => handleUndo(node),
            rename: (name) => {
              dispatch(
                renameComponent({
                  parentName: 'parameters',
                  name,
                  oldName: s,
                }),
              );
            },
          },
          metadata: {
            rightLabel: spec.components.parameters[s]?.in,
          },
        })),
      },
    ];
  };

  const originalTreeData = getTreeData(openapi);

  const handleAddItem = (node, callback) => {
    const copyTreeData = treeData.slice(0);
    copyTreeData.map((t) =>
      t.type === node.type
        ? t.children.push({
            name: '',
            type: getChildType(node.type),
            isEdited: true,
            actions: {
              rename: (props) => callback(props),
            },
          })
        : t,
    );
    setTreeData(copyTreeData);
  };

  const generateContextMenu = (node) => {
    const menuItems = [];
    if (node.type === 'paths') {
      menuItems.push({
        text: 'New Path',
        onClick: () => {
          handleAddItem(node, (path) => {
            dispatch(addPath({path}));
          });
        },
      });
    } else if (node.type === 'models') {
      menuItems.push({
        text: 'New Model',
        onClick: () => {
          handleAddItem(node, (newNode) => {
            dispatch(addComponent({parentName: 'schemas', name: newNode}));
          });
        },
      });
    } else if (node.type === 'responses') {
      menuItems.push({
        text: 'New Response',
        onClick: () => {
          handleAddItem(node, (newNode) => {
            dispatch(addComponent({parentName: 'responses', name: newNode}));
          });
        },
      });
    } else if (node.type === 'examples') {
      menuItems.push({
        text: 'New Example',
        onClick: () => {
          handleAddItem(node, (newNode) => {
            dispatch(addComponent({parentName: 'examples', name: newNode}));
          });
        },
      });
    } else if (node.type === 'parameters') {
      ['query', 'path', 'header', 'cookie'].forEach((param) => {
        const paramName = param[0].toUpperCase() + param.slice(1);
        menuItems.push({
          text: `New ${paramName} parameter`,
          onClick: () => {
            handleAddItem(node, (newNode) => {
              dispatch(
                addComponent({
                  parentName: 'parameters',
                  name: newNode,
                  parameter: param,
                }),
              );
            });
          },
        });
      });
    } else if (node.type === 'requestBodies') {
      menuItems.push({
        text: 'New Request Body',
        onClick: () => {
          handleAddItem(node, (newNode) => {
            dispatch(
              addComponent({parentName: 'requestBodies', name: newNode}),
            );
          });
        },
      });
    }

    if (
      [
        'path',
        'model',
        'response',
        'example',
        'parameter',
        'requestBody',
      ].indexOf(node.type) >= 0
    ) {
      if (menuItems.length) {
        menuItems.push({
          divider: true,
        });
      }

      menuItems.push(
        {
          text: 'Rename',

          onClick: () => {
            node.isEdited = true;
            const treeDataCopy = treeData.slice(0);
            setTreeData(treeDataCopy);
          },
        },
        {
          text: 'Delete ' + node.type,

          onClick: () => {
            const parentType = getChildType(node.type, true);
            const modelType =
              node.type === 'path' ? ['paths'] : ['components', parentType];
            dispatch(handleModelDelete({path: [...modelType, node.name]}));
          },
        },
      );
    }

    if (node.type === 'path' && 'operations' in node.metadata) {
      menuItems.push({
        text: 'Delete Operation',
        children: node.metadata.operations.items.map((item) => ({
          text: '' + item.method.toUpperCase(),
          onClick: () => {
            dispatch(
              handleModelDelete({
                path: ['paths', node.name, item.method],
              }),
            );
          },
        })),
      });
    }

    return menuItems;
  };

  const [treeData, setTreeData] = React.useState(originalTreeData);

  useEffect(() => {
    const modified = originalTreeData.map((item) => ({
      ...item,
      expanded: treeData.find((i) => i.type === item.type).expanded,
    }));
    setTreeData(modified);
  }, [openapi]);

  const handleClick = (e, node, {location}) => {
    if (location !== undefined) {
      onClick({path: location});
    }
  };

  return (
    <Tree
      className="sidebar-bg"
      generateContextMenu={generateContextMenu}
      onClick={handleClick}
      treeData={treeData}
      store={treeStore}
      onChange={({treeData}) => {
        setTreeData(treeData);
      }}
    />
  );
};

Sidebar.propTypes = {
  onClick: PropTypes.func,
  openapi: PropTypes.object,
};

export default Sidebar;
