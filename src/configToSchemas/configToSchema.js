// Dummy schema for title/body/image element.
const any = () => ({ type: 'string' });

export default function configToSchema(config) {
  const {
    booleanDefault,
    choices,
    default: defaultValue,
    elements,
    list,
    maximum,
    minimum,
    multipleOf,
    name,
    no,
    pattern,
    readOnly,
    required,
    title,
    type,
    yes,
  } = config;

  const selectableItem = () => ({
    enum: choices.map((v, i) => v?.enum || String(i)),
    enumNames: choices.map((v) => v?.enumNames || v),
    title: name,
    type: 'string',
  });

  const text = () => ({
    default: defaultValue,
    ...(required ? { minLength: 1 } : undefined),
    pattern,
    readOnly,
    title: name,
    type: 'string',
  });

  const converter = {
    body: any,
    boolean: () => ({
      type: 'boolean',
      enumNames: [yes, no],
      default: booleanDefault,
    }),
    date: () => ({
      format: 'date',
      type: 'string',
    }),
    email: text,
    form: () => ({
      title,
      type: 'object',
      properties: Object.fromEntries(
        elements.map((element, index) => [
          element.key ?? String(index),
          configToSchema(element),
        ])
      ),
    }),
    formGroup: () => {
      const item = {
        type: 'object',
        properties: Object.fromEntries(
          elements.map((element, index) => [
            element.key ?? String(index),
            configToSchema(element),
          ])
        ),
      };
      return {
        title,
        ...(list ? { type: 'array', items: item } : item),
      };
    },
    image: any,
    multiselect: () => ({
      items: selectableItem(),
      title: name,
      type: 'array',
      uniqueItems: true,
    }),
    password: text,
    range: () => ({
      default: defaultValue ?? minimum ?? 0,
      maximum,
      minimum,
      multipleOf,
      type: 'number',
    }),
    select: () => ({
      title: name,
      ...selectableItem(),
    }),
    text,
    textarea: text,
    title: any,
  }[type];

  if (!converter) {
    // eslint-disable-next-line no-console
    console.error(`Config type "${type}" is not implemented.`);
    return {};
  }

  return converter();
}
