import React from 'react';
import {observer} from 'mobx-react';
import Panel from './panel';
import {StoresContext} from '../../Context';
import {Tooltip2} from '@blueprintjs/popover2';
import {Button, Icon} from '@blueprintjs/core';

const Lint = observer(() => {
  const stores = React.useContext(StoresContext);
  return (
    <>
      <div className="EditorPanel EditorPanel--secondary EditorPanel--diagnostics group p-0 flex flex-col overflow-hidden absolute inset-0">
        <Panel />
      </div>
      <div className="absolute top-0 right-0 h-10 pr-3 pt-2">
        <Tooltip2 content={<div className="text-sm">Close Panel</div>}>
          <Button
            text={<Icon size={12} icon="cross" />}
            minimal
            small
            onClick={() =>
              stores.uiStore.toggleWidget(stores.uiStore.widgets.lint)
            }
          />
        </Tooltip2>
      </div>
    </>
  );
});

export default Lint;
