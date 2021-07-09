import deprecate from 'util-deprecate';
import extendType from './_extendType';
import select from './select';
import { defineMessage } from 'react-intl';
import { ensureValueIsAvailable } from '../../utils';
import { setLegacyMode } from '../../legacyMode';

const multiselectWidget = deprecate(({ multiselectWidget, ...config }) => {
  setLegacyMode();

  return {
    widget: { 0: 'checkboxes' }[multiselectWidget],
    ...config,
  };
}, 'config.multiselectWidget is deprecated. Use config.widget instead. Example: "widget": "checkboxes"');

export default extendType(select, ({ config }) => (props) => {
  if (config.multiselectWidget !== undefined) {
    config = multiselectWidget(config);
  }

  if (config.choices?.length) {
    props.schema = {
      items: props.schema,
      type: 'array',
      uniqueItems: true,
      default: [],
    };
  }

  props.uiSchema = {
    'ui:widget': config.choices?.length
      ? ensureValueIsAvailable(config.widget, widgets)
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
