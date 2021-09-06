import deprecate from 'util-deprecate';
import { setLegacyMode } from '../../legacyMode';

const selectWidget = deprecate(({ selectWidget, ...config }) => {
  setLegacyMode();

  return {
    widget: { 0: 'radio' }[selectWidget],
    ...config,
  };
}, 'config.selectWidget is deprecated. Use config.widget instead. Example: "widget": "radio"');

export default (config) => {
  if (config.type === 'select') {
    if (config.selectWidget) {
      config = selectWidget(config);
    }
  }

  return config;
};
