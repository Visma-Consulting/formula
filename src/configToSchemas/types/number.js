import { defineMessage } from 'react-intl';

export default ({
  config: { numberDefault: defaultValue, maximum, minimum, multipleOf, numberOfDecimals },
}) => ({
  schema: {
    default: defaultValue < minimum || defaultValue > maximum ? undefined : defaultValue ?? undefined,
    maximum,
    minimum,
    multipleOf,
    type: ['number', 'null'],
    allowedCharacters: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '.'],
    numberOfDecimals: numberOfDecimals
  },
});

export const name = defineMessage({
  defaultMessage: 'Numero',
});

export const elementType = 'field';
