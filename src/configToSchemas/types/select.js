export default ({
  config: { choices, choicesDisabled, placeholder, selectWidget },
}) => ({
  schema: {
    enum: choices.map((v, i) => v?.enum || String(i)),
    enumNames: choices.map((v) => v?.enumNames || v),
    type: 'string',
  },
  uiSchema: {
    'ui:placeholder': placeholder,
    'ui:widget': { 0: 'radio' }[selectWidget],
    //'ui:field': autocomplete ? Autocomplete : undefined,
    'ui:enumDisabled': choicesDisabled,
  },
});
