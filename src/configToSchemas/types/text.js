import { defineMessage } from 'react-intl';

export default ({ config }) => {
  const {
    default: defaults,
    minLength,
    maxLength,
    pattern,
    patternDescription,
    required,
  } = config;

  return {
    schema: {
      default: defaults,
      minLength: minLength ?? (required ? 1 : undefined),
      maxLength,
      pattern,
      type: 'string',
    },
    uiSchema: { patternDescription },
  };
};

export const name = defineMessage({
  defaultMessage: 'Tekstikenttä',
});

export const elementType = 'field';
