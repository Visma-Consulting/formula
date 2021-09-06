import deprecate from 'util-deprecate';
import { setLegacyMode } from '../../legacyMode';

const formgroupType = deprecate((config) => {
  setLegacyMode();

  return { ...config, type: 'formGroup' };
}, 'type "formgroup" is deprecated. Use "formGroup" instead.');

export default (config) => {
  if (config.type === 'formgroup') {
    config = formgroupType(config);
  }

  return config;
};
