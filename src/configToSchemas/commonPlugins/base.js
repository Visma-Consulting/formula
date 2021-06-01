export default (config) => (props) => {
  props.schema ??= {};
  props.schema.required = config.required;
  props.schema.readOnly = config.readOnly;

  props.uiSchema ??= {};
  props.uiSchema['ui:help'] = config.help;
  props.uiSchema['ui:description'] = config.description;
  props.uiSchema['ui:disabled'] = config.disabled;
  props.uiSchema['ui:readonly'] = config.readOnly;
  if (config.hidden) {
    props.uiSchema['ui:widget'] = 'hidden';
  }
};
