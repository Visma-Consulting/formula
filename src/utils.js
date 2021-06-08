import { mapValues, omitBy } from 'lodash';

export const setDefaultType = (type) => (config) => ({ type, ...config });

export const typesWithElements = ['form', 'formGroup', 'formgroup'];

export const omitDeepBy = (object, test) =>
  mapValues(omitBy(object, test), function traverse(entry) {
    return Array.isArray(entry)
      ? entry.map(traverse)
      : typeof entry === 'object'
      ? omitDeepBy(entry, test)
      : entry;
  });
