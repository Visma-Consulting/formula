export default (config) => (props) => {
  if (config.list) {
    const { title, ...itemsSchema } = props.schema;

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
      minItems: config.minItems
    };

    props.uiSchema = {
      'ui:description': description,
      'ui:help': help,
      items: itemsUISchema,
    };
  }
};
