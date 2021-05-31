export default (config) => (props) => {
  props.uiSchema ??= {};
  props.uiSchema['ui:help'] = config.help;
  props.uiSchema['ui:description'] = config.description;
};
