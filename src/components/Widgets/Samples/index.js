import React from 'react';
import {observer} from 'mobx-react';
import {
  useBundleRefsIntoDocument,
  useParsedValue,
  TryItWithRequestSamples,
} from '@stoplight/elements-core';
import {transformOas3Operation} from '@stoplight/http-spec/oas3';
import {Tooltip2} from '@blueprintjs/popover2';
import {Button, Icon} from '@blueprintjs/core';
import {Provider as MosaicProvider} from '@stoplight/mosaic';
import {decodeUriFragment} from '../../../utils';
import {StoresContext} from '../../Context';

const Samples = observer(() => {
  const stores = React.useContext(StoresContext);
  const spec = stores.graphStore.rootNode.data.parsed;
  const baseUrl = '';
  const parsedDocument = useParsedValue(spec);
  const bundledDocument = useBundleRefsIntoDocument(parsedDocument, {
    baseUrl,
  });

  const {
    path: {activePathNode},
    service: {activeOperationNodes, activeOperationNode},
  } = stores.oasStore;

  React.useEffect(() => {
    if (!activePathNode) {
      stores.uiStore.toggleWidget(stores.uiStore.widgets.samples);
    }
  }, [activePathNode]);

  const {url: mockUrl} = stores.mockStore;

  let currentOperationNode = activeOperationNode || activeOperationNodes[0];

  const item = React.useMemo(
    () =>
      activePathNode
        ? transformOas3Operation({
            path: decodeUriFragment(activePathNode.path),
            method: currentOperationNode.path,
            document: bundledDocument,
          })
        : null,
    [bundledDocument, currentOperationNode, activePathNode],
  );

  return (
    <MosaicProvider>
      <div className="App pt-10">
        {item && (
          <TryItWithRequestSamples httpOperation={item} mockUrl={mockUrl} />
        )}
      </div>
      <div className="absolute top-0 right-0 h-10 pr-3 pt-2">
        <Tooltip2 content={<div className="text-sm">Close Panel</div>}>
          <Button
            text={<Icon size={12} icon="cross" />}
            minimal
            small
            onClick={() =>
              stores.uiStore.toggleWidget(stores.uiStore.widgets.samples)
            }
          />
        </Tooltip2>
      </div>
    </MosaicProvider>
  );
});

export default Samples;
