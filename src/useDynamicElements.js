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

  const findElement = elements.find(el => el.key === element.key);

  // eslint-disable-next-line @super-template/no-loops/no-loops
  for (let i = elements.indexOf(findElement) - 1; i >= 0; i--) {
    if (elements[i].type === 'pageTitle') {
      return elements[i];
      break;
    }
  }

  // If page title was not found, return first page title
  return elements.find(element => element.type === 'pageTitle');
}

function resetDisabledToDefaultValues(formData, initialFormData, config, allDisabled) {
  if (!formData || typeof formData !== 'object') {return formData}
  let resetFormData = Array.isArray(formData) ? [...formData] : {...formData};

  for (const key in formData) {
    const element = config.elements.find(element => element.key === key);
    if (allDisabled || (element?.filter?.enable && !sift(element.filter.enable.query)(formData))) {
      if (initialFormData && initialFormData[key]) {
        resetFormData[key] = initialFormData[key];
      } else if (element.elements && element.elements.length > 0) {
        const resetSubValues = resetDisabledToDefaultValues(
          formData[key] ?? undefined,
          initialFormData ? initialFormData[key] : undefined,
          element,
          true
        );
        if (!resetSubValues) {
          delete resetFormData[key];
        } else {
          resetFormData[key] = element.list ? [resetSubValues] : resetSubValues;
        }
      } else if (element.default !== undefined) {
        if (element.list) {
          resetFormData[key] = Array(element.minItems > 1 ? element.minItems : 1).fill(element.default);
        } else {
          resetFormData[key] = element.default;
        }
      } else {
        delete resetFormData[key];
      }
    } else if (element?.elements && element?.elements?.length > 0) {
      if (element.skipDisable) {
        resetFormData[key] = formData[key];
      } else if (element.list) {
        resetFormData[key] = formData[key]?.map((datum, i) => resetDisabledToDefaultValues(
          datum ?? undefined,
          initialFormData?.[key] ? initialFormData[key][i] : undefined,
          element,
          false
        ))
      } else {
        const resetSubValues = resetDisabledToDefaultValues(
          formData[key] ?? undefined,
          initialFormData ? initialFormData[key] : undefined,
          element,
          false
        );
        resetFormData[key] = resetSubValues;
      }
    }
  }

  return resetFormData;
}

const getIndentNumber = (element, elements) => {
  const query = element?.filter?.show?.query;

  if (query) {
    const source = Object.keys(query)[0];
    const sourceElement = elements.find(element => element.key === source);
    if (sourceElement && !sourceElement.hidden) {
      return 1 + getIndentNumber(sourceElement, elements);
    }
  }

  return 0;
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

        return {...element, indent: getIndentNumber(element, elements)}
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
    __useDynamicElements_original_props__: props,
    formData,
    config: dynamicElements(props.config, formData),
    onChange(...args) {
      const [{ formData}] = args;
      const resetFormData = resetDisabledToDefaultValues(formData, initialFormData, props.config, false);
      props.onChange?.(...args);
      setFormData(resetFormData);
    },
  };
}
