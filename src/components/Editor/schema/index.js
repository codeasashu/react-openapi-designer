import React from 'react';
import {observer} from 'mobx-react-lite';
import {getValueFromStore, usePatchOperation} from '../../utils/selectors';
import {TabList, TabPanel, Tabs} from 'react-tabs';
import {Button, Icon} from '@blueprintjs/core';

const SchemaEditor = observer(
  ({className: e, schemaPath: t, examplesPath: n, mediaType: r, spec: o}) => {
    const [selectedIndex, setSelectedIndex] = React.useState(0); // a, u

    const l = Tp(a);
    const handlePatch = usePatchOperation(); //d
    const notJsonSchema = spec !== 'json_schema'; //h
    const examples = getValueFromStore(examplesPath); //f
    const exampleNames = keys(examples); //p
    const g = Tp(p);
    const m = c.useRef(null);
    const v = c.useRef(false);

    const {activeSourceNode: y} = Object(k.a)('uiStore');

    const b = Object(M.a)();

    React.useEffect(() => {
      if (p.length) {
        if (g.length > p.length) {
          const e = l - 1;
          u(e < 0 ? 0 : e);
        }
      } else {
        u(0);
      }
    }, [p.length, g.length, l]);

    React.useLayoutEffect(() => {
      if (v.current) {
        v.current = false;
      } else {
        if (m && m.current) {
          m.current.focus();
        }
      }
    }, [a]);

    return (<div className={className}>
      <Tabs
          selectedIndex={selectedIndex}
          onSelect={(e) => setSelectedIndex(e)}
        >
        <TabList>
          <Tab>Schema</Tab>
          {exampleNames.map((e) => (<Tab key={e}>{e}</Tab>))}
          <Button
              minimal={true}
              small={true}
              className='ml-2 mb-1/2'
              icon={<Icon
                icon='plus'
                iconSize={12} />}
              onClick={() => {
                const e = (() => {
                  var e;

                  try {
                    if (y) {
                      const n = Ni(y, t, false, ['resolved']);

                      if (!Object(oe.c)(n)) {
                        throw Error(
                          'Cannot generate an example. Invalid Schema',
                        );
                      }

                      const r =
                        (e = y.data.resolved) !== null && e !== undefined
                          ? e
                          : y.data.parsed;

                      const i = Object(Xp.sample)(
                        o === 'json_schema'
                          ? n
                          : Object(Jp.translateSchemaObject)(r, n),
                        {
                          skipWriteOnly: true,
                        },
                        r,
                      );

                      if (i !== null) {
                        if (o === 'oas3') {
                          return {
                            value: i,
                          };
                        } else {
                          return i;
                        }
                      }
                    }
                  } catch (e) {
                    O.a.error(e);
                  }

                  return Eg;
                })();

                d(
                  _t.b.Add,
                  n.concat(h ? 'example-' + (p.length + 1) : p.length),
                  e,
                );
                u(p.length + 1);
              }}>Example</Button>
          </TabList>
        <TabPanel>
          <>
          c.createElement(
            i.d,
            {
              bg: 'canvas',
              border: b === 'bp3-dark' ? 2 : 0,
            },
            c.createElement(Sg, {
              relativeJsonPath: t,
              maxRows: 25,
            }),
          ),
        ),
        p.map((e) =>
          c.createElement(
            Ap.SimpleTabPanel,
            {
              key: e,
            },
            c.createElement(
              i.d,
              {
                className: 'p-4',
                bg: 'canvas',
                border: b === 'bp3-dark' ? 2 : 0,
              },
              c.createElement(Dg, {
                spec: o,
                inputRef: m,
                examplePath: n.concat(e),
                exampleValuePath: n.concat(o === 'oas3' ? [e, 'value'] : e),
                mediaType: r,
              }),
            ),
          ),
        ),
      ),
    );
  },
);

export default SchemaEditor;
