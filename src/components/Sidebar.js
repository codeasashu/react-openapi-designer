import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {useDispatch} from 'react-redux';
import {addComponent, addPath} from 'store/modules/openapi';
import Tree from './Common/TreeList/Tree';
import {isValidPathMethod} from '../utils';
import set from 'lodash.set';

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

const getChildType = (nodeType) => {
  const nodeTypes = {
    paths: 'path',
    models: 'model',
    responses: 'response',
    parameters: 'parameter',
    examples: 'example',
  };
  if (Object.keys(nodeTypes).indexOf(nodeType) >= 0) {
    return nodeTypes[nodeType];
  }
  return null;
};

const Sidebar = ({openapi, onClick}) => {
  const dispatch = useDispatch();

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
    console.log('copyTreeData', copyTreeData);
    setTreeData(copyTreeData);
  };

  const generateContextMenu = (node) => {
    const menuItems = [];
    if (node.type === 'paths') {
      menuItems.push({
        text: 'New Path',
        onClick: () => {
          console.log('add new path');
          handleAddItem(node, (path) => {
            console.log('addPath', path);
            dispatch(addPath({path}));
          });
        },
      });
    } else if (node.type === 'models') {
      menuItems.push({
        text: 'New Model',
        onClick: () => {
          handleAddItem(node, (newNode) => {
            console.log('addModel', newNode);
            dispatch(addComponent({parentName: 'schemas', name: newNode}));
          });
        },
      });
    } else if (node.type === 'responses') {
      menuItems.push({
        text: 'New Response',
        onClick: () => {
          console.log('add new response');
          handleAddItem(node, (newNode) => {
            console.log('addResponse', newNode);
            dispatch(addComponent({parentName: 'responses', name: newNode}));
          });
        },
      });
    } else if (node.type === 'examples') {
      menuItems.push({
        text: 'New Example',
        onClick: () => {
          console.log('add new example');
          handleAddItem(node, (newNode) => {
            console.log('addExample', newNode);
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
            console.log(`add new ${param} parameter`);
            handleAddItem(node, (newNode) => {
              console.log('addParameter', newNode);
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
          console.log('add new requestBody');
          handleAddItem(node, (newNode) => {
            console.log('addRequestBody', newNode);
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
            console.log('Deleteing ', node.type);
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
            console.log('deleting operation for', item, node);
          },
        })),
      });
    }

    return menuItems;
  };

  const getTreeData = React.useCallback(
    (spec) => {
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
              rename: (newProps) => {
                console.log('rename path', newProps, spec.paths[p]);
              },
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
              rename: (newProps) => {
                console.log(
                  'rename model',
                  newProps,
                  spec.components.schemas[s],
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
              rename: (newProps) => {
                console.log(
                  'rename response',
                  newProps,
                  spec.components.schemas[s],
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
              rename: (newProps) => {
                console.log(
                  'rename parameter',
                  newProps,
                  spec.components.schemas[s],
                );
              },
            },
            metadata: {
              rightLabel: spec.components.parameters[s]?.in,
            },
          })),
        },
      ];
    },
    [openapi],
  );

  const [treeData, setTreeData] = React.useState(getTreeData(openapi));

  useEffect(() => {
    const menuItems = getTreeData(openapi);
    const modified = menuItems.map((item) => ({
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
      generateContextMenu={generateContextMenu}
      onClick={handleClick}
      treeData={treeData}
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
