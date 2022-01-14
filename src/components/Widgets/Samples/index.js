import React from 'react';
import {observer} from 'mobx-react';
import {
  useBundleRefsIntoDocument,
  useParsedValue,
  TryItWithRequestSamples,
} from '@stoplight/elements-core';
import {Tooltip2} from '@blueprintjs/popover2';
import {Button, Icon} from '@blueprintjs/core';
import {Provider as MosaicProvider} from '@stoplight/mosaic';
import {NodeType} from '@stoplight/types';
import {transformOasToServiceNode} from '../../../utils/oas';
import {StoresContext} from '../../Context';

const Samples = observer(() => {
  const stores = React.useContext(StoresContext);
  const spec = stores.graphStore.rootNode.data.parsed;
  const baseUrl = '';
  const parsedDocument = useParsedValue(spec);
  const bundledDocument = useBundleRefsIntoDocument(parsedDocument, {
    baseUrl,
  });
  const serviceNode = React.useMemo(
    () => transformOasToServiceNode(bundledDocument),
    [bundledDocument],
  );

  const getOperationItems = (serviceNode) => {
    const ungrouped = [];
    for (const node of serviceNode.children) {
      if (node.type !== NodeType.HttpOperation) continue;
      ungrouped.push(node);
    }
    return ungrouped;
  };

  const items = getOperationItems(serviceNode);
  const item = items.length ? items[0] : null;

  return (
    <MosaicProvider>
      <div className="App pt-10">
        {item && <TryItWithRequestSamples httpOperation={item.data} />}
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
