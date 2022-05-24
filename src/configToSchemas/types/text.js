import { defineMessage, useIntl } from 'react-intl';

export default ({ config }) => {
  const {
    default: defaults,
    minLength,
    maxLength,
    pattern,
    required,
  } = config;
  const intl = useIntl();
  const patternDescription = config.patternDescription ? config.patternDescription : intl.formatMessage({ defaultMessage: 'muu kuin tyhjä' });
  return {
    schema: {
      default: defaults,
      minLength: minLength ?? (required ? 1 : undefined),
      maxLength,
      pattern: pattern ?? (required ? '[^\\s]+' : undefined),
      type: 'string',
    },
    uiSchema: { patternDescription },
  };
};

export const validators = {
  hetu: {
    name: defineMessage({
      defaultMessage: 'Hetu'
    }),
    fn: (value, errors) => {
      console.log(value);
    }
  }
};

export const name = defineMessage({
  defaultMessage: 'Tekstikenttä',
});

export const elementType = 'field';
