//@flow
import React from 'react';
import {Context} from './components';
import Stores from './Stores';
import Designer from './designer';
import PropTypes from 'prop-types';

class App extends React.Component {
  constructor(props) {
    super();
    this.state = {
      spec: props.spec,
    };
  }

  say(callback) {
    console.log('Hello', this.state.spec);
    callback(this.state.spec);
  }

  setSpec(spec) {
    console.log('setting spec', spec);
    this.setState({spec});
  }

  render() {
    const {spec, ...props} = this.props;
    return (
      <Context.StoresContext.Provider value={new Stores(spec)}>
        <Designer {...props} onChange={(spec) => this.setSpec(spec)} />
      </Context.StoresContext.Provider>
    );
  }
}

App.propTypes = {
  spec: PropTypes.object,
};

export default App;
