import {
  intersection,
  isEqual,
  mapValues,
  pickBy,
  isPlainObject,
} from 'lodash';
import { typesWithElements, useStatePreferInitial } from './utils';

const pickDeepBy = (value, predicate) =>
  (function pickDeep(value) {
    return isPlainObject(value)
      ? mapValues(pickBy(value, predicate), pickDeep)
      : value;
  })(value);

export const show = (formData, element) => {
  const rule = element.filter?.show;

  if (!rule) {
    return true;
  }

  const value = formData[rule.target];

  function test({
    anyOf,
    allOf,
    exists,
    equals,
    unequals,
    includesEvery,
    includesSome,
  }) {
    return allOf
      ? allOf.every(test)
      : anyOf
      ? anyOf.some(test)
      : exists !== undefined
      ? exists
        ? value !== undefined
        : value === undefined
      : equals === undefined && unequals === undefined
      ? includesEvery === undefined
        ? includesSome === undefined
          ? true
          : intersection(value, includesSome).length
        : intersection(value, includesEvery).length === includesEvery.length
      : unequals === undefined
      ? isEqual(
          pickDeepBy(value, (value) => value !== undefined),
          equals
        )
      : !isEqual(
          pickDeepBy(value, (value) => value !== undefined),
          unequals
        );
  }

  return test(rule);
};

export function dynamicElements(config, formData = {}) {
  // config.list element is filtered in ArrayField component.
  if (config.list || !typesWithElements.includes(config.type)) {
    return config;
  }

  return {
    ...config,
    elements: config.elements
      .filter(function test(element) {
        const rule = element.filter?.show;

        if (!rule) {
          return true;
        }

        const target = config.elements.find(
          (element) => element.key === rule.target
        );

        return target && test(target) && show(formData, element);
      })
      .map((element) => dynamicElements(element, formData[element.key])),
  };
}

export const filterElements = (elements, formData = {}) =>
  elements.filter((element) => {
    const rule = element.filter?.show;

    if (!rule) {
      return true;
    }

    return show(formData, element);
  });

export default function useDynamicElements(props) {
  const [formData, setFormData] = useStatePreferInitial(props.formData);

  return {
    ...props,
    formData,
    config: dynamicElements(props.config, formData),
    onChange(...args) {
      const [{ formData }] = args;
      props.onChange?.(...args);
      setFormData(formData);
    },
  };
}
