import deprecate from 'util-deprecate';
import extendType from './_extendType';
import select from './select';

const multiselectWidget = deprecate(({ multiselectWidget, ...config }) => {
  return {
    widget: { 0: 'checkboxes' }[multiselectWidget],
    ...config,
  };
}, 'config.multiselectWidget is deprecated. Use config.widget instead. Example: "widget": "checkboxes"');

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
    'ui:widget': config.widget,
  };
});
