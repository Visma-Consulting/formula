import { isFinite } from 'lodash';
import { typesWithElements } from '../utils';

const setDefaultKeys = (elements) => {
  let indexKey = Math.max(
    0,
    ...elements
      .map((element) => element.key)
      .map(Number)
      .filter(isFinite)
  );

  return elements
    .map((element) =>
      element.key === undefined
        ? {
            ...element,
            key: String(indexKey++),
          }
        : element
    )
    .map(setElementDefaultKeys);
};

export default function setElementDefaultKeys(config) {
  return typesWithElements.includes(config.type)
    ? {
        ...config,
        elements: setDefaultKeys(config.elements),
      }
    : config;
}
