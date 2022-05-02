import { defineMessage } from 'react-intl';
import { ensureValueIsAvailable } from '../../utils';
import select from './select';
import extendType from './_extendType';
import sift from 'sift';

function MultiSelect(props) {
  const { widget, choices = [], filterDialog } = props.options.element;
  const data = props.value ?? [];
  const disabled = [];
  const ensuredWidget = ensureValueIsAvailable(widget, widgets)

  if (!filterDialog) {
    for (const [i, choice] of choices.entries()) {
      if (choice.enumDisabled) {
        const choiceEnum = choice.enum ? choice.enum : `${i}`;
        if (sift(choice.enumDisabled.selected?.query)(data)) {
          disabled.push(choiceEnum);
          if (!data.includes(choiceEnum)) {
            props.value.push(choiceEnum);
          }
        }
        if (sift(choice.enumDisabled.notSelected?.query)(data)) {
          disabled.push(choiceEnum);
          if (data.includes(choiceEnum)) {
            props.value.splice(props.value.indexOf(choiceEnum), 1);
          }
        }
      }
    }
  }

  const Widget = ensuredWidget === 'select' ? props.registry.widgets.SelectWidget
    : ensuredWidget && ensuredWidget.startsWith('checkboxes') ? props.registry.widgets.CheckboxesWidget
      : null;

  return (
    <>
      { Widget ?
        <Widget {...props}
          options={{...props.options,
            enumOptions: props.options.enumOptions ? props.options.enumOptions : [],
            enumDisabled: disabled
          }} />
        : null }
    </>
  );
}

export default extendType(select, ({ config }) => (props) => {
  const {
    autocomplete,
    choices = [],
    minItems,
    required,
    widget,
    autoSort = false
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

  props.schema =
    choicesSorted.length || autocomplete
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
        default: [],
        readOnly: true,
      };
  props.uiSchema = {
    'ui:widget': MultiSelect,
    'ui:options': {
      inline: widget && widget.endsWith('Row')
    }
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
      defaultMessage: 'Valintaruudut allekkain',
    }),
  },
  {
    value: 'checkboxesRow',
    message: defineMessage({
      defaultMessage: 'Valintaruudut rivissä',
    }),
  },
];
