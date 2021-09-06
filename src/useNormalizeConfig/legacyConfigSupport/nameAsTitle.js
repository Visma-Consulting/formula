import deprecate from 'util-deprecate';
import { setLegacyMode } from '../../legacyMode';

const nameAsTitle = deprecate(({ name, ...config }, props) => {
  setLegacyMode();

  return {
    title: name,
    ...config,
  };
}, 'config.name is deprecated. Use config.title instead.');

export default (config) => {
  if (config.name) {
    config = nameAsTitle(config);
  }

  return config;
};
