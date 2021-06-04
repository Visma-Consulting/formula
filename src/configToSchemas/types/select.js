import deprecate from 'util-deprecate';

const selectWidget = deprecate(
  ({ selectWidget, ...config }) => ({
    widget: { 0: 'radio' }[selectWidget],
    ...config,
  }),
  'config.selectWidget is deprecated. Use config.widget instead. Example: "widget": "radio"'
);

export default ({ config }) => {
  if (config.selectWidget) {
    config = selectWidget(config);
  }

  const { choices, choicesDisabled, placeholder, widget } = config;

  return {
    schema: {
      enum: choices.map((v, i) => v?.enum || String(i)),
      enumNames: choices.map((v) => v?.enumNames || v),
      type: 'string',
    },
    uiSchema: {
      'ui:placeholder': placeholder,
      'ui:widget': widget,
      //'ui:field': autocomplete ? Autocomplete : undefined,
      'ui:enumDisabled': choicesDisabled,
    },
  };
};
