import { defineMessage } from 'react-intl';
import deprecate from 'util-deprecate';

const textDefault = deprecate(
  ({ textDefault, ...other }) => ({ default: textDefault, ...other }),
  'config.textDefault is deprecated. Use config.default instead.'
);

export default ({ config }) => {
  if (config.textDefault) {
    config = textDefault(config);
  }

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

export const showInEditor = true;
