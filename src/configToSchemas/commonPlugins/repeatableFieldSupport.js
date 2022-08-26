const nonListFields = ['boolean', 'consent', 'tableField'];

const getDefaultByType = (type) => {
  switch (type) {
    case 'text': case 'textarea': case 'richtext': case 'email': case 'password':
      return '';
    case 'formGroup':
      return {};
    default:
      return undefined;
  }
}

export default (config) => (props) => {
  if (config.list && !nonListFields.includes(config.type)) {
    const { title, default: defaults, ...itemsSchema } = props.schema;
    const { emptyDefault = false } = config;

    const {
      'ui:description': description,
      'ui:help': help,
      ...itemsUISchema
    } = props.uiSchema;

    const type = itemsUISchema?.['ui:options']?.element?.type;
    const defaultByType = defaults ?? getDefaultByType(type);

    props.schema = {
      title,
      type: 'array',
      items: itemsSchema,
      maxItems: config.maxItems,
      minItems: config.minItems,
      default: emptyDefault ? [] : config.minItems > 1 ? Array(config.minItems).fill(defaultByType) : [defaultByType],
    }

    props.uiSchema = {
      'ui:description': description,
      'ui:help': help,
      items: itemsUISchema,
    };
  }
};
