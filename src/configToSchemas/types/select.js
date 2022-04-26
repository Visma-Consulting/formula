import { defineMessage } from 'react-intl';
import { ensureValueIsAvailable } from '../../utils';

export default ({ config }) => {
  const {
    choices = [],
    choicesDisabled,
    placeholder,
    default: defaults,
    selectType = 'string',
    autocomplete,
    autoSort = false,
    widget
  } = config;
  const choicesSorted = [...choices];

  if (autoSort) {
    choicesSorted.sort((el1, el2) => {
      const el1Name = el1.enumNames ? el1.enumNames : el1.enum;
      const el2Name = el2.enumNames ? el2.enumNames : el2.enum;
      if (el1Name > el2Name) {
        return 1
      }  else if (el1Name < el2Name) {
        return -1
      }
      return 0;
    })
  }

  return {
    schema:
      choicesSorted.length || autocomplete
        ? {
            default: defaults,
            enum: choicesSorted.map((v, i) => v?.enum ?? String(i)),
            enumNames: choicesSorted.map((v) =>
              typeof v === 'object' ? v.enumNames : v
            ),
            type: selectType,
          }
        : // Empty list of choices (enums) matches incorrectly when used in
          // dynamic list item, when oneOf has multiple fields with same key.
          {
            type: selectType,
            default: '',
            readOnly: true,
          },
    uiSchema: {
      'ui:placeholder': placeholder,
      'ui:widget': choices.length && widget
        ? ensureValueIsAvailable(widget.endsWith('Row') ? widget.slice(0,-3) : widget, widgets)
        : // If enums are not set, the widget may throw error.
          undefined,
      // 'ui:field': autocomplete ? AutocompleteSelectField : undefined,
      'ui:enumDisabled': choicesDisabled,
      'ui:options': {
        inline: widget && widget.endsWith('Row')
      }
    },
  };
};

export const name = defineMessage({
  defaultMessage: 'Valinta',
});

export const elementType = 'field';

export const widgets = [
  {
    value: 'select',
    message: defineMessage({
      defaultMessage: 'Valintalista',
    }),
  },
  {
    value: 'radio',
    message: defineMessage({
      defaultMessage: 'Radiopainikkeet allekkain',
    }),
  },
  {
    value: 'radioRow',
    message: defineMessage({
      defaultMessage: 'Radiopainikkeet rivissä',
    }),
  },
];
