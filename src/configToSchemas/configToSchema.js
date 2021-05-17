import * as list from './list';
import * as title from './title';

// Dummy schema for title/body/image element.
const any = () => ({ type: 'string' });

export default function configToSchema(config) {
  const {
    booleanDefault,
    choices,
    default: defaultValue,
    elements,
    maximum,
    minimum,
    multipleOf,
    no,
    pattern,
    readOnly,
    required,
    type,
    yes,
  } = config;

  const selectableItem = () => ({
    enum: choices.map((v, i) => v?.enum || String(i)),
    enumNames: choices.map((v) => v?.enumNames || v),
    type: 'string',
  });

  const text = () => ({
    default: defaultValue,
    ...(required ? { minLength: 1 } : undefined),
    pattern,
    readOnly,
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
      type: 'object',
      properties: Object.fromEntries(
        elements.map((element, index) => [
          element.key ?? String(index),
          configToSchema(element),
        ])
      ),
    }),
    formGroup: () => ({
      type: 'object',
      properties: Object.fromEntries(
        elements.map((element, index) => [
          element.key ?? String(index),
          configToSchema(element),
        ])
      ),
    }),
    image: any,
    multiselect: () => ({
      items: selectableItem(),
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

  return converter() |> title.schema(config) |> list.schema(config);
}
