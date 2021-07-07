import deprecate from 'util-deprecate';
import { setLegacyMode } from '../legacyMode';

const nameAsTitle = deprecate(({ name, ...config }, props) => {
  setLegacyMode();

  return {
    title: name,
    ...config,
  };
}, 'config.name is deprecated. Use config.title instead.');

export default (config) => {
  const { name } = config;

  if (name) {
    return nameAsTitle(config);
  }

  return config;
};
