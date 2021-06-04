import { typesWithElements } from '../utils';

export default (config) =>
  typesWithElements.includes(config.type)
    ? { elements: [], ...config }
    : config;
