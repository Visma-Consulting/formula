import { defineMessage, useIntl } from 'react-intl';

export default (config) => ({
  schema: {
    type: 'boolean',
    enum: [true],
    default: false,
    title: config.checkboxTitle,
  }
});

export const name = defineMessage({
  defaultMessage: 'Suostumus',
});

export const elementType = 'field';


