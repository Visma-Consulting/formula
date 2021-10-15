import { pick } from 'lodash';
import sift from 'sift';
import { typesWithElements, useStatePreferInitial } from './utils';

// const show = (formData, element) => {
//   const rule = element.filter?.show;

//   if (!rule) {
//     return true;
//   }

//   return sift(element.filter.show.query)(formData);
// };

export const isArrayRule = (rule) => ['$or', '$and'].includes(rule);

export const toTarget = (element) => {
  const [{ query } = {}] =
    (element.filter && Object.values(element.filter)) ?? [];
  if (query) {
    const { $and, $or, ...other } = query;

    const [[key, value]] = Object.entries({ $and, $or, ...other }).filter(
      ([rule, value]) =>
        isArrayRule(rule) ? value?.length : value !== undefined
    );

    return isArrayRule(key) ? Object.keys(value[0])[0] : key;
  }
};

export function dynamicElements(config, formData = {}) {
  // config.list element is filtered in ArrayField component.
  if (config.list || !typesWithElements.includes(config.type)) {
    return config;
  }

  let elements = config.elements;
  let checkChanges = true;

  // eslint-disable-next-line @super-template/no-loops/no-loops
  while (checkChanges) {
    const { length } = elements;
    const keys = elements.map((element) => element.key);
    const filteredFormData = pick(formData, keys);
    elements = elements
      .filter(function test(element) {
        const query = element.filter?.show?.query;

        if (!query) {
          return true;
        }

        return sift(query)(filteredFormData);
      })
      .map((element) =>
        dynamicElements(element, filteredFormData[element.key])
      );
    checkChanges = elements.length !== length;
  }

  return {
    ...config,
    elements,
  };
}

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
