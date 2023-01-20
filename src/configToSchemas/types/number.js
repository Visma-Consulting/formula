import { defineMessage } from 'react-intl';

export default ({
  config: { numberDefault: defaultValue, maximum, minimum, multipleOf },
}) => ({
  schema: {
    default: defaultValue < minimum || defaultValue > maximum ? undefined : defaultValue ?? undefined,
    maximum,
    minimum,
    multipleOf,
    type: 'number',
  },
});

export const name = defineMessage({
  defaultMessage: 'Numero',
});

export const elementType = 'field';
