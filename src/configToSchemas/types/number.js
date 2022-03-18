import { defineMessage } from 'react-intl';

export default ({
  config: { default: defaultValue, maximum, minimum, multipleOf },
}) => ({
  schema: {
    default: defaultValue < minimum || defaultValue > maximum ? undefined : defaultValue ?? minimum ?? undefined,
    maximum,
    minimum,
    multipleOf,
    type: 'number',
  },
});

export const name = defineMessage({
  defaultMessage: 'Kokonaisluku',
});

export const elementType = 'field';
