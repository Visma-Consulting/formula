import { mapValues, omitBy } from 'lodash';
import { forwardRef, useEffect, useState } from 'react';
import { defineMessage } from 'react-intl';
import { defineMessages } from '@formatjs/intl';

export const setDefaultType = (type) => (config) => ({ type, ...config });

export const typesWithElements = ['form', 'formGroup'];

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

export const withPropsUpdater = (updater) => (Component) =>
  forwardRef(({__useDynamicElements_original_props__, ...props}, ref) => {
    return __useDynamicElements_original_props__ ?
      <Component
        ref={ref}
        {...updater({...props, __useDynamicElements_original_props__})}
        __useDynamicElements_original_props__={updater(__useDynamicElements_original_props__)}
      />
    :
      <Component
        ref={ref}
        {...updater(props)}
      /> ;
  });

export const sortChoices = (choices = [], autoSort) => {
  const choicesSorted = choices.map((choice, index) =>
    choice.enum ? choice : { ...choice, enum: `${index}` }
  );

  if (autoSort) {
    choicesSorted.sort((el1, el2) => {
      const el1Name = el1.enumNames ? el1.enumNames : el1.enum;
      const el2Name = el2.enumNames ? el2.enumNames : el2.enum;
      if (el1Name > el2Name) {
        return 1;
      } else if (el1Name < el2Name) {
        return -1;
      }
      return 0;
    });
  }

  return choicesSorted;
};

// Chain function calls until some returns falsy return value. Optionally update args.
export const chain =
  (funcs) =>
  async (...args) => {
    for (const func of funcs.filter(Boolean)) {
      const proceed = await func(...args);
      if (Array.isArray(proceed)) {
        args = proceed;
      }
      if (!proceed) {
        return proceed;
      }
    }
    return args;
  };

export function Customize({ customizer: Customizer, children, ...otherProps }) {
  return Customizer ? (
    <Customizer {...otherProps}>{children}</Customizer>
  ) : (
    children
  );
}

export function getAriaLabel(label, options, required, requiredMessage) {
  let ariaLabel = label;

  if (!ariaLabel) {
    const element = options.element;
    ariaLabel = element.useLabel
      ? element.label === "" || !element.label
        ? element.labelError
        : element.label
      : element.title;
  }

  if (required) {
    ariaLabel = `${requiredMessage}: ${ariaLabel}`;
  }

  return ariaLabel;
}

// Create a consistent id for the field description element
export const descriptionId = id => `${id}__description`;

// Create a consistent id for the field help element
export const helpId = id => `${id}__help`;

// Create a consistent id for the field errors element
export const errorsId = id => `${id}__errors`;

// Create a list of element ids that contain additional information about the
// field
export const ariaDescribedBy = (id, uiSchema, rawErrors) => {
  const listElement = uiSchema?.["ui:options"]?.element?.list;
  let ariaId = `${
    uiSchema["ui:description"] ||
    uiSchema?.element?.description ||
    uiSchema["ui:options"]?.element?.description
      ? descriptionId(listElement ? id.substring(0, id.lastIndexOf("_")) : id)
      : ""
  } ${
    uiSchema["ui:help"] ||
    uiSchema?.element?.help ||
    uiSchema["ui:options"]?.element?.help
      ? helpId(listElement ? id.substring(0, id.lastIndexOf("_")) : id)
      : ""
  } ${rawErrors?.length > 0 ? errorsId(id) : ""}`;
  if (ariaId !== "" && ariaId.length > 2) {
    return ariaId;
  }
};

const generalErrorMessages = defineMessages({
  duplicateKeyError: {
    defaultMessage: "Vaihtoehdoissa ei saa olla duplikaatti vierasavaimia."
  },
  missingKeyError: {
    defaultMessage: "Vaihtoehdoilla täytyy olla vierasavaimet."
  }
});

export const generalValidators = {
  noDuplicateKeys: {
    name: defineMessage({defaultMessage: "Ei duplikaatti avaimia"}),
    fn: (value, _) => {
      if (value && value.length > 0) {
        const keys = [];
        for (const choice of value) {
          if (!choice.enum) {
            return generalErrorMessages.missingKeyError;
          } else if (!keys.includes(choice.enum)) {
            keys.push(choice.enum);
          } else {
            return generalErrorMessages.duplicateKeyError;
          }
        }
      }
    }
  }
}
