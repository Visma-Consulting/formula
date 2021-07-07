import { map, update } from 'lodash/fp';
import { typesWithElements } from '../utils';

export default function maybeSetElements(config) {
  return typesWithElements.includes(config?.type)
    ? { elements: [], ...config } |> update('elements', map(maybeSetElements))
    : config;
}
