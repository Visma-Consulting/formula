import deprecate from 'util-deprecate';
import { setLegacyMode } from '../../legacyMode';

const multiselectWidget = deprecate(({ multiselectWidget, ...config }) => {
  setLegacyMode();

  return {
    widget: { 0: 'checkboxes' }[multiselectWidget],
    ...config,
  };
}, 'config.multiselectWidget is deprecated. Use config.widget instead. Example: "widget": "checkboxes"');

export default (config) => {
  if (config.type === 'multiselect') {
    if (config.multiselectWidget !== undefined) {
      config = multiselectWidget(config);
    }
  }

  return config;
};
