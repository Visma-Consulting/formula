export default (config) => (props) => {
  props.schema ??= {};
  props.schema.readOnly ??= config.readOnly;

  props.uiSchema ??= {};
  props.uiSchema['ui:help'] = config.help;
  props.uiSchema['ui:description'] = config.description;
  props.uiSchema['ui:disabled'] = config.disabled;
  props.uiSchema['ui:readonly'] = config.readOnly;
  if (config.hidden) {
    props.uiSchema['ui:widget'] = 'hidden';
  }
  props.uiSchema['ui:options'] ??= {};
  // ArrayField requires access to config, to filter item properties per each item
  props.uiSchema['ui:options'].element = config;
};
