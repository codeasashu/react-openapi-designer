//@flow
import React from 'react';
import {Context} from './components';
import Stores from './Stores';
import Designer from './designer';
import PropTypes from 'prop-types';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.listener = null;
  }
  setListener(listener) {
    this.listener = listener;
  }

  setSpec(spec) {
    console.log('setting spec', spec);
    if (this.listener) {
      this.listener(spec);
    }
  }

  render() {
    const {spec, ...props} = this.props;
    return (
      <Context.StoresContext.Provider value={new Stores(spec)}>
        <Designer {...props} onChange={this.setSpec.bind(this)} />
      </Context.StoresContext.Provider>
    );
  }
}

App.propTypes = {
  spec: PropTypes.object,
};

export default App;
