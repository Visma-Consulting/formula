import { defineMessage } from 'react-intl';
import deprecate from 'util-deprecate';
import { ensureValueIsAvailable } from '../../utils';

const selectWidget = deprecate(
  ({ selectWidget, ...config }) => ({
    widget: { 0: 'radio' }[selectWidget],
    ...config,
  }),
  'config.selectWidget is deprecated. Use config.widget instead. Example: "widget": "radio"'
);

export default ({ config }) => {
  if (config.selectWidget) {
    config = selectWidget(config);
  }

  const {
    choices = [],
    choicesDisabled,
    placeholder,
    default: defaults,
  } = config;

  return {
    schema: {
      default: defaults,
      enum: choices.map((v, i) => v?.enum || String(i)),
      enumNames: choices.map((v) => v?.enumNames || v),
      type: 'string',
    },
    uiSchema: {
      'ui:placeholder': placeholder,
      'ui:widget': ensureValueIsAvailable(config.widget, widgets),
      //'ui:field': autocomplete ? Autocomplete : undefined,
      'ui:enumDisabled': choicesDisabled,
    },
  };
};

export const name = defineMessage({
  defaultMessage: 'Valinta',
});

export const showInEditor = true;

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
