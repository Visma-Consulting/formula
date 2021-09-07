import deprecate from 'util-deprecate';
import { setLegacyMode } from '../../legacyMode';

const textDefault = deprecate(({ textDefault, ...other }) => {
  setLegacyMode();

  return { default: textDefault, ...other };
}, 'config.textDefault is deprecated. Use config.default instead.');

export default (config) => {
  if (
    config.type === 'text' ||
    config.type === 'textarea' ||
    config.type === 'richtext'
  ) {
    if (config.textDefault) {
      config = textDefault(config);
    }
  }

  return config;
};
