import { defineMessage } from 'react-intl';
import { ensureValueIsAvailable } from '../../utils';
import select from './select';
import extendType from './_extendType';

export default extendType(select, ({ config }) => (props) => {
  const { autocomplete, choices, minItems, required, widget } = config;

  props.schema =
    choices?.length || autocomplete
      ? {
          items: props.schema,
          type: 'array',
          uniqueItems: true,
          default: [],
          minItems: minItems ?? (required ? 1 : undefined),
        }
      : // Empty list of choices (enums) matches incorrectly when used in
        // dynamic list item, when oneOf has multiple fields with same key.
        {
          type: 'string',
          default: '',
          readOnly: true,
        };
  props.uiSchema = {
    'ui:widget': choices?.length
      ? ensureValueIsAvailable(widget, widgets)
      : // If enums are not set, the widget may throw error.
        undefined,
  };
});

export const name = defineMessage({
  defaultMessage: 'Monivalinta',
});

export const elementType = 'field';

export const widgets = [
  {
    value: 'select',
    message: defineMessage({
      defaultMessage: 'Monivalintalista',
    }),
  },
  {
    value: 'checkboxes',
    message: defineMessage({
      defaultMessage: 'Valintaruudut',
    }),
  },
];
