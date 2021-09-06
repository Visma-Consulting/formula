import deprecate from 'util-deprecate';
import { setLegacyMode } from '../../legacyMode';

const booleanWidget = deprecate(({ booleanWidget, ...config }) => {
  setLegacyMode();

  return {
    widget: {
      0: 'radio',
      1: 'select',
      2: 'switch',
      3: 'switchWithEmptyOption',
    }[booleanWidget],
    ...config,
  };
}, 'config.booleanWidget is deprecated. Use config.widget instead. Example: "widget": "radio"');

export default (config) => {
  if (config.type === 'boolean') {
    if (config.booleanWidget !== undefined) {
      config = booleanWidget(config);
    }
  }

  return config;
};
