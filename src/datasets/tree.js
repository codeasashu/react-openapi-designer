export const NodeTypes = {
  Overview: 'overview',
  Paths: 'paths',
  Path: 'path',
  Operation: 'operation',
  Model: 'model',
  Models: 'models',
  Response: 'response',
  Responses: 'responses',
  RequestBody: 'requestBody',
  RequestBodies: 'requestBodies',
  Parameter: 'parameter',
  Parameters: 'parameters',
  Examples: 'examples',
  Example: 'example',
  Components: 'components',
  Schemas: 'schemas',
};

export const eventTypes = {
  NodeMouseEnter: 'node.mouseenter',
  NodeMouseLeave: 'node.mouseexit',
  NodeClick: 'node.click',
  NodeDoubleClick: 'node.doubleClick',
  NodeCaretClick: 'node.caretClick',
  NodeExpand: 'node.expand',
  Drop: 'drop',
  EditCancel: 'edit.cancel',
  ValidationError: 'edit.validationError',
  BeforeEditComplete: 'edit.beforecomplete',
  AfterEditComplete: 'edit.aftercomplete',

  // Graph events
  GraphNodeAdd: 'graph.node_add',
  DidAddSourceMapNode: 'graph.source_map_node_add',
  DidPatchSourceNodeProp: 'graph.patch_sourcemap_node',
  DidChangeSourceNode: 'graph.did_changed_source_node',
  DidPatchSourceNodePropComplete: 'graph.did_patch_source_complete',
  DidUpdateNodeUri: 'graph.did_update_node_uri',
  DidRemoveNode: 'graph.did_remove_node',
  DidPatch: 'graph.did_patch_node',
  ComputeSourceMap: 'graph.compute_source_map',

  // sidebar events
  CreatePath: 'action.create_path',
  CreateModel: 'action.create_model',
  CreateExample: 'action.create_example',
  CreateParameter: 'action.create_parameter',
  CreateResponse: 'action.create_response',
  CreateRequestBody: 'action.create_request_body',
  RenameNode: 'action.rename_node',
  DeleteNode: 'action.delete_node',
  DeleteHttpMethod: 'action.delete_http_method',

  // Store events
  StoreEvents: {
    ExtraPropUpdate: 'store.extra_prop_update',
    Change: 'store.change',
    Transformed: 'store.transformed',
    GoToRef: 'store.goto_ref',
  },

  // Schema events
  GoToRef: 'schema.goto_ref',
};

export const taskTypes = {
  ReadSourceNode: 'read_source_node',
};

export const NodeCategories = {
  Source: 'source',
  SourceMap: 'source_map',
  Virtual: 'virtual',
};

export const nodeOperations = {
  AddNode: 'add_node',
  SetSourceNodeProp: 'set_source_node_props',
  PatchSourceNodeProp: 'patch_source_node_props',
  RemoveNode: 'remove_node',
  MoveNode: 'move_node',
  Add: 'add_child_node',
  Move: 'move_child_node',
  Replace: 'replace_child_node',
  Remove: 'remove_child_node',
  Text: 'text_child_node',
};
