export const lang = 'en_US';

const langs = {
  en_US: {
    title: 'Title',
    import_json: 'Import JSON',
    base_setting: 'Base Setting',
    all_setting: 'Source Code',
    default: 'Default',
    description: 'Description',
    adv_setting: 'Advanced Settings',
    add_child_node: 'Add child node',
    add_sibling_node: 'Add sibling nodes',
    add_node: 'Add sibling/child nodes',
    child_node: 'Child node',
    sibling_node: 'Sibling node',
    ok: 'OK',
    cancel: 'Cancel',
    minLength: 'Min length',
    maxLength: 'Max length',
    pattern: 'MUST be a string and SHOULD be a valid regular expression.',
    exclusiveMinimum: 'Value strictly less than',
    exclusiveMaximum: 'Value strictly more than',
    minimum: 'Min',
    maximum: 'Max',
    unique_items: 'Unique Items',
    min_items: 'MinItems',
    max_items: 'MaxItems',
    checked_all: 'Checked All',
    valid_json: 'Not valid json',
    enum: 'Enum',
    enum_msg: 'One value per line',
    enum_desc: 'desc',
    enum_desc_msg: 'enum description',
    required: 'required',
    mock: 'mock',
    mockLink: 'Help',
  },
};

export default message => {
  return langs[lang][message];
};
