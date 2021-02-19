import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as schemaDesignerActions from './src/redux/modules/schema-designer';

import SchemaDesigner from './src/schema-designer';

const mapStateToProps = ({ schemaDesigner }) => {
  const { schema, open } = schemaDesigner;
  return { schema, open };
};

const mapDispatchToProps = dispatch => {
  const schema = bindActionCreators(schemaDesignerActions, dispatch);
  return {
    changeEditorSchema: schema.changeEditorSchema,
    changeName: schema.changeName,
    changeValue: schema.changeValue,
    changeType: schema.changeType,
    enableRequire: schema.enableRequire,
    requireAll: schema.requireAll,
    deleteItem: schema.deleteItem,
    addField: schema.addField,
    addChildField: schema.addChildField,
    setOpenValue: schema.setOpenValue,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SchemaDesigner);
