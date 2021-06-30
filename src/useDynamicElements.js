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

export const dynamicElements = (config, formData = {}) => {
  if (!typesWithElements.includes(config.type)) {
    return config;
  }

  return {
    ...config,
    elements: config.elements
      .filter(function show(element) {
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
              : intersection(value, includesEvery).length ===
                includesEvery.length
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

        const target = config.elements.find(
          (element) => element.key === rule.target
        );

        return target && show(target) && test(rule);
      })
      .map((element) => dynamicElements(element, formData[element.key])),
  };
};

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
