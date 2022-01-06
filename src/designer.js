//@flow
import React from 'react';
import PropTypes from 'prop-types';
import {Sidebar, Gutter, Content, Context} from './components';
import {observer} from 'mobx-react-lite';

const Designer = observer((props) => {
  const stores = React.useContext(Context.StoresContext);
  const {activeView, views, fullscreen} = stores.uiStore;
  const shouldShowSidebar =
    fullscreen === false && activeView !== views.preview;
  React.useEffect(() => {
    const spec = stores.graphStore.rootNode.data.parsed;
    if (props.onChange) {
      props.onChange(spec);
    }
  }, [stores.graphStore.rootNode.data.parsed]);

  return (
    <div className="dark bp3-dark">
      <div className={'OasContainer h-screen w-full'}>
        <div className={'Studio h-full flex flex-1 flex-col'}>
          <div className={'flex flex-1'}>
            {shouldShowSidebar && (
              <Sidebar
                fullscreen={stores.uiStore.fullscreen}
                style={{
                  width: 'calc(18% - 2px)',
                  maxWidth: '375px',
                  minWidth: '290px',
                }}
                className={'flex flex-col border-r'}
              />
            )}
            <Gutter layout="horizontal" />
            <Content />
          </div>
        </div>
      </div>
    </div>
  );
});

Designer.propTypes = {
  openapi: PropTypes.object,
  onChange: PropTypes.func,
};

export default Designer;
