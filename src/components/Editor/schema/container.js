import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react-lite';
import {omit} from 'lodash';
import {getValueFromStore, usePatchOperation} from '../../utils/selectors';
import {TabList, TabPanel, Tabs} from 'react-tabs';
import {Button, Icon} from '@blueprintjs/core';
import Editor from './editor';
import {StoresContext} from '../../Tree/context';
import GenerateSchema from '../../../generate-schema';

function sg(e = '', t = []) {
  return t.find((t) => {
    var n;
    return !!((n = t.matcher) === null || n === undefined
      ? undefined
      : n.call(t, e));
  });
}

const SchemaContainer = observer((props) => {
  // e
  var {relativeJsonPath} = props; // t

  var n = Object(h.g)(e, ['relativeJsonPath']);
  const [generate, setGenerate] = React.useState(false); // [r,i]
  const stores = React.useContext(StoresContext);
  const {activeSourceNodeId, activeSourceNode} = stores.uiStore; // o,a

  const u = hg(
    a && b.d.Json_Schema !== a.spec ? (b.d.OAS2 === a.spec ? yg : bg) : vg,
  );

  const schemaCollection = stores.jsonSchemaCollection; //l

  //const {nodeEndpointTemplateUrl: d} = Object(k.a)('settingsStore');

  //const f = new ng.URI.Template(d);

  if (!activeSourceNodeId) {
    return null;
  }

  const nodeId = relativeJsonPath
    ? [activeSourceNodeId, ...relativeJsonPath].join('/')
    : activeSourceNodeId; //p

  const schemaStore = schemaCollection.lookup(nodeId, {
    //g
    id: nodeId,
    relativeJsonPath,
    sourceNodeId: activeSourceNodeId,
  });

  const generateSchema = (value) => {
    let schema = omit(GenerateSchema(value), '$schema');
    console.log('generateSchema11', schema);
    //t['x-examples'] = {
    //'example-1': e,
    //};

    setGenerate(false);
    schemaStore.store.emit(Za.Change, schema);
  };

  if (generate) {
    return React.createElement(xg, {
      onCancel: () => setGenerate(false),
      onGenerate: generateSchema,
    });
  } else {
    return (
      <div>
        <Button
          icon={<Icon icon="magic" className="mt-3 ml-4 mb-2" />}
          onClick={() => setGenerate(true)}>
          Generate from JSON
        </Button>
        {React.createElement(
          Xs,
          Object.assign(
            {
              customRowActionRenderer: (e) => {
                console.log('customRowActionRenderer22', e);
                //const {refPath: t} = e;

                //if (t !== undefined) {
                //const n = sg(t, u);

                //if (ug.SCDM === (n == null ? undefined : n.name)) {
                //return c.createElement(Mg, Object.assign({}, e));
                //}
                //}

                return null;
              },

              refSelector: (props) => console.log('refSelector11', props),

              store: schemaStore.store,

              getRefLabel: (e) => {
                /*
                const t = sg(e, u);

                if (t) {
                  return t.getRefLabel(e);
                } else {
                  return e;
                }*/
                console.log('Getting Ref Label for', e);
              },

              shouldRenderGoToRef: () => false,
            },
            n,
          ),
        )}
      </div>
    );
  }
});

export default SchemaContainer;
