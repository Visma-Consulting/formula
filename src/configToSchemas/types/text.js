import { defineMessage, useIntl } from 'react-intl';
import { defineMessages } from '@formatjs/intl';

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

const validationMessages = defineMessages({
  hetuError: {
    defaultMessage: `"{title}" ei saa sisältää kolmea peräkkäistä a-kirjainta.`
  }
});

export const validators = {
  hetu: {
    name: defineMessage({
      defaultMessage: 'Hetu'
    }),
    fn: (value, element) => {
      if (value?.includes('aaa')) {
        return validationMessages.hetuError;
      }
    }
  }
};

export const name = defineMessage({
  defaultMessage: 'Tekstikenttä',
});

export const elementType = 'field';
