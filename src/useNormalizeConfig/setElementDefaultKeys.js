import { typesWithElements } from '../utils';

export default function setElementDefaultKeys(config) {
  return typesWithElements.includes(config.type)
    ? {
        ...config,
        elements: config.elements
          .map((element, index) => ({
            key: String(index),
            ...element,
          }))
          .map(setElementDefaultKeys),
      }
    : config;
}
