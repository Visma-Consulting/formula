import deprecate from 'util-deprecate';
import { setLegacyMode } from '../../legacyMode';

const booleanDefault = deprecate(({ booleanDefault, ...other }) => {
  setLegacyMode();

  return { default: booleanDefault, ...other };
}, 'config.booleanDefault is deprecated. Use config.default instead.');

export default (config) => {
  if (config.type === 'boolean') {
    if (config.booleanDefault !== undefined) {
      config = booleanDefault(config);
    }
  }
  return config;
};
