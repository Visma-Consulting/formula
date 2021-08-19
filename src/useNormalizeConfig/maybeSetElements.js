import { map, update } from 'lodash/fp';
import { typesWithElements } from '../utils';
import deprecate from 'util-deprecate';
import { setLegacyMode } from '../legacyMode';

const formgroupType = deprecate((config) => {
  setLegacyMode();

  return { ...config, type: 'formGroup' };
}, 'type "formgroup" is deprecated. Use "formGroup" instead.');

export default function maybeSetElements(config) {
  if (config.type === 'formgroup') {
    config = formgroupType(config);
  }
  return typesWithElements.includes(config?.type)
    ? { elements: [], ...config } |> update('elements', map(maybeSetElements))
    : config;
}
