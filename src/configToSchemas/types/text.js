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
    fn: (value, errors, key) => {
      console.log(value);
      console.log(errors);
      if (value === 'aaa') {
        if (key) {
          errors[key].addError('Tässä on kolme a:ta');
        } else {
          console.log('täällä')
          errors.addError('Tässä on kolme a:ta');
        }
      }
    }
  }
};

export const name = defineMessage({
  defaultMessage: 'Tekstikenttä',
});

export const elementType = 'field';
