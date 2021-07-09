import { defineMessage } from 'react-intl';
import deprecate from 'util-deprecate';
import { ensureValueIsAvailable } from '../../utils';
import { setLegacyMode } from '../../legacyMode';

const selectWidget = deprecate(({ selectWidget, ...config }) => {
  setLegacyMode();

  return {
    widget: { 0: 'radio' }[selectWidget],
    ...config,
  };
}, 'config.selectWidget is deprecated. Use config.widget instead. Example: "widget": "radio"');

export default ({ config }) => {
  if (config.selectWidget) {
    config = selectWidget(config);
  }

  const {
    choices = [],
    choicesDisabled,
    placeholder,
    default: defaults,
    selectType = 'string',
  } = config;
  return {
    schema: choices.length
      ? {
          default: defaults,
          enum: choices.map((v, i) => v?.enum || String(i)),
          enumNames: choices.map((v) =>
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
      'ui:widget': choices.length
        ? ensureValueIsAvailable(config.widget, widgets)
        : // If enums are not set, the widget may throw error.
          undefined,
      //'ui:field': autocomplete ? Autocomplete : undefined,
      'ui:enumDisabled': choicesDisabled,
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
      defaultMessage: 'Radiopainikkeet',
    }),
  },
];
