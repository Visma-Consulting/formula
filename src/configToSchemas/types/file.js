export default ({ acceptFiles }) => ({
  schema: {
    format: 'data-url',
    type: 'string',
  },
  uiSchema: {
    'ui:options': {
      accept: acceptFiles?.map((ext) => `.${ext}`).join(','),
    },
  },
});
