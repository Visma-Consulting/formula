export default ({ booleanDefault, yes, no }) => ({
  schema: {
    type: 'boolean',
    enumNames: [yes, no],
    default: booleanDefault,
  },
});
