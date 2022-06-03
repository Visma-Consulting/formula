import { forwardRef } from 'react';
import { validators as textValidators } from './configToSchemas/types/text';
import { useIntl } from 'react-intl';

const elementHasValidator = (element) => {
  return element.validator && element.validator !== 'none'
}

export default function withCustomValidation(Form) {
  return forwardRef(
    ({ config, ...props }, ref) => {
      const intl = useIntl();
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

        const validateOne = (formData, errors, element, listIndex) => {
          console.log(element);
          console.log(listIndex);
          const { key, type, validator } = element;
          const errorMessage = validateFunctions[type]?.[validator]?.fn?.(formData, element);
          if (errorMessage) {
            if (key) {
              if (listIndex !== null) {
                errors[key][listIndex].addError(intl.formatMessage(errorMessage, {...element}));
              } else {
                errors[key].addError(intl.formatMessage(errorMessage, {...element}));
              }
            } else {
              if (listIndex !== null) {
                errors[listIndex].addError(intl.formatMessage(errorMessage, {...element}));
              } else {
                errors.addError(intl.formatMessage(errorMessage, {...element}));
              }
            }
          }
        }

        const validateAll = (formData, errors, elements) => {
          for (const element of elements) {
            const { key, type, validator, list } = element;
            if (list) {
              for (const dataIndex in formData[key]) {
                validateOne(formData[key][dataIndex], errors, element, dataIndex);
              }
            } else if (type === 'formGroup') {
              validateAll(formData[key], errors[key], element.elements);
            } else {
              validateOne(formData[key], errors, element);
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
