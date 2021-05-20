export const types = ['text', 'textarea'];

export default (config) => (props) => {
  props.uiSchema ??= {};
  props.uiSchema['ui:options'] ??= {};
  props.uiSchema['ui:options'].showCharacterCounter =
    config.showCharacterCounter;
};
