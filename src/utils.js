import { mapValues, omitBy } from 'lodash';
import { useEffect, useState } from 'react';

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

export const ensureValueIsAvailable = (value, list) =>
  list.find((item) => item.value === value) ? value : undefined;

export function useStatePreferInitial(initialState) {
  const state = useState(initialState);

  useEffect(() => {
    const [value, setValue] = state;

    if (value !== initialState) {
      setValue(initialState);
    }
    // We intentionally	run this effect only on when initialState changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialState]);

  return state;
}
