import { defineMessage } from 'react-intl';

export default ({ config: { acceptFiles } }) => ({
  schema: {
    format: 'data-url',
    type: 'string',
  },
  uiSchema: {
    'ui:options': {
      accept: acceptFiles?.map((ext) => `.${ext}`).join(','),
    },
  },
});

export const name = defineMessage({
  defaultMessage: 'Tiedosto',
});

export const showInEditor = true;
