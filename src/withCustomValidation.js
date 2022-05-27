import { forwardRef } from 'react';
import { validators as textValidators } from './configToSchemas/types/text';

const elementHasValidator = (element) => {
  return element.validator && element.validator !== 'none'
}

export default function withCustomValidation(Form) {
  return forwardRef(
    ({ config, ...props }, ref) => {
      const validateElements = (config.type === 'form' ? config.elements : [config])
        //.filter(element => element.validator && element.validator !== 'none');
        .map((element) => {
          if (element.type === 'formGroup') {
            return {...element, elements: element.elements.filter(elementHasValidator)}
          } else {
            return element;
          }
        })
        .filter(element => (element.type === 'formGroup' && element.elements?.length > 0) || elementHasValidator(element));
      if (validateElements.length > 0) {
        const validateFunctions = {
          text: textValidators
        }

        const validateAll = (formData, errors, elements) => {
          for (const element of elements) {
            const { key, type, validator } = element;
            if (type === 'formGroup') {
              validateAll(formData[key], errors[key], element.elements);
            } else {
              validateFunctions[type]?.[validator]?.fn?.(key ? formData[key] : formData, errors, key);
            }
          }
          return errors;
        }

        return <Form
          config={config}
          validate={(formData, errors) => validateAll(formData, errors, validateElements)}
          ref={ref}
          {...props}
        />;
      } else {
        return <Form config={config} ref={ref} {...props} />;
      }
    }
  )
}
