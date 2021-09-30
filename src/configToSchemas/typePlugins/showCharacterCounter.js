export const types = ['text', 'textarea'];

export const converter =
  ({ config }) =>
  (props) => {
    props.uiSchema ??= {};
    props.uiSchema['ui:options'] ??= {};
    props.uiSchema['ui:options'].showCharacterCounter =
      config.showCharacterCounter;
  };
