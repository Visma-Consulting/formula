import deprecate from 'util-deprecate';
import extendType from './_extendType';
import select from './select';
import { defineMessage } from 'react-intl';
import { ensureValueIsAvailable } from '../../utils';

const multiselectWidget = deprecate(
  ({ multiselectWidget, ...config }) => ({
    widget: { 0: 'checkboxes' }[multiselectWidget],
    ...config,
  }),
  'config.multiselectWidget is deprecated. Use config.widget instead. Example: "widget": "checkboxes"'
);

export default extendType(select, ({ config }) => (props) => {
  if (config.multiselectWidget !== undefined) {
    config = multiselectWidget(config);
  }

  props.schema = {
    items: props.schema,
    type: 'array',
    uniqueItems: true,
  };
  props.uiSchema = {
    'ui:widget': ensureValueIsAvailable(config.widget, widgets),
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
