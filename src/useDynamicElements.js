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

function pageTitleElementOf(elements, element) {
  if (elements.findIndex(element => element.type === 'pageTitle') === -1) {
    return undefined;
  }

  // eslint-disable-next-line @super-template/no-loops/no-loops
  for (let i = elements.indexOf(element) - 1; i >= 0; i--) {
    if (elements[i].type === 'pageTitle') {
      return elements[i];
      break;
    }
  }

  // If page title was not found, return first page title
  return elements.find(element => element.type === 'pageTitle');
}

function resetDisabledToDefaultValues(formData, initialFormData, config) {
  if (!formData || typeof formData !== 'object') {return formData}
  let resetFormData = Array.isArray(formData) ? [...formData] : {...formData};

  for (const key in formData) {
    const element = config.elements.find(element => element.key === key);
    if (element?.filter?.enable && !sift(element.filter.enable.query)(formData)) {
      if (initialFormData[key]) {
        resetFormData[key] = initialFormData[key];
      } else if (element.default) {
        resetFormData[key] = element.default;
      } else {
        delete resetFormData[key];
      }
    }
  }

  return resetFormData;
}

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

        const pageTitle = pageTitleElementOf(config.elements, element);
        if (pageTitle !== undefined && element.type !== 'pageTitle' && !elements.includes(pageTitle)) {
          return false;
        }

        if (!query) {
          return true;
        }

        return sift(query)(filteredFormData);
      })
      .map((element) =>
        dynamicElements(element, filteredFormData[element.key])
      ).map((element) => {
        if (element.type === 'pageTitle') {
          return element;
        }

        const query = element.filter?.show?.query;

        if (query) {
          const source = Object.keys(element.filter.show.query)[0];
          if (!elements.find(element => element.key === source)?.hidden) {
            return {...element, indent: true}
          }
        }

        return {...element, indent: false}
      }
    ).map(element => {
        const query = element.filter?.enable?.query;

        if (!query) {
          return element;
        } else {
          return { ...element, disabled: !sift(query)(filteredFormData) }
        }
      }
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
  const [initialFormData] = useStatePreferInitial(props.formData);

  return {
    ...props,
    formData,
    config: dynamicElements(props.config, formData),
    onChange(...args) {
      const [{ formData}] = args;
      const resetFormData = resetDisabledToDefaultValues(formData, initialFormData, props.config);
      props.onChange?.(...args);
      setFormData(resetFormData);
    },
  };
}
