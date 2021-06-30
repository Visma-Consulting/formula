import { defineMessage } from 'react-intl';

export default ({
  config: { default: defaultValue, maximum, minimum, multipleOf },
}) => ({
  schema: {
    default: defaultValue ?? minimum ?? 0,
    maximum,
    minimum,
    multipleOf,
    type: 'number',
  },
});

export const name = defineMessage({
  defaultMessage: 'Kokonaisluku',
});

export const showInEditor = true;
