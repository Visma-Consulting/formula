export default (config) => (props) => {
  if (config.list) {
    const { title, default: defaults, ...itemsSchema } = props.schema;

    const {
      'ui:description': description,
      'ui:help': help,
      ...itemsUISchema
    } = props.uiSchema;

    props.schema = {
      title,
      type: 'array',
      items: itemsSchema,
      maxItems: config.maxItems,
      minItems: config.minItems,
      default: [defaults],
    };

    props.uiSchema = {
      'ui:description': description,
      'ui:help': help,
      items: itemsUISchema,
    };
  }
};
