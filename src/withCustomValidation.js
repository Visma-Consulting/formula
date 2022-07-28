import { forwardRef } from 'react';
import { validators as textValidators } from './configToSchemas/types/text';
import { validators as formGroupValidators } from './configToSchemas/typePlugins/formGroupList';
import { useIntl } from 'react-intl';

const elementHasValidator = (element) => {
  return element.validator && element.validator !== 'none'
}

export default function withCustomValidation(Form) {
  return forwardRef(
    ({ config, validate, ...props }, ref) => {
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
          text: textValidators,
          formGroup: formGroupValidators
        }

        const validateOne = (formData, errors, element, listIndex) => {
          console.log(element);
          const { key, type, validator } = element;
          const errorMessage = validateFunctions[type]?.[validator]?.fn?.(formData, element);
          if (errorMessage) {
            if (key) {
              if (listIndex !== undefined) {
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

        const validateFormGroup = (formData, errors, elements, listIndex) => {
          if (listIndex !== undefined) {
            for (const element of elements) {
              const {key, list} = element;
              if (list) {
                for (const dataIndex in formData[key]) {
                  validateOne(formData[listIndex][dataIndex], errors[listIndex], element, dataIndex);
                }
              } else {
                validateOne(formData[key], errors[listIndex], element);
              }
            }
          } else {
            for (const element of elements) {
              const {key, list} = element;
              if (list) {
                for (const dataIndex in formData[key]) {
                  validateOne(formData[key][dataIndex], errors, element, dataIndex);
                }
              } else {
                validateOne(formData[key], errors, element);
              }
            }
          }
        }

        const validateAll = (formData, errors, elements) => {
          for (const element of elements) {
            const { key, type, list, validator } = element;
            if (list) {
              if (type === 'formGroup') {
                if (validator) {
                  validateOne(formData[key], errors, element);
                } else {
                  for (const dataIndex in formData[key]) {
                    validateFormGroup(formData[key][dataIndex], errors[key], element.elements, dataIndex);
                  }
                }
              } else {
                for (const dataIndex in formData[key]) {
                  validateOne(formData[key][dataIndex], errors, element, dataIndex);
                }
              }
            } else if (type === 'formGroup') {
              validateFormGroup(formData[key], errors[key], element.elements);
            } else {
              validateOne(formData[key], errors, element);
            }
          }
          return errors;
        }

        return <Form
          config={config}
          validate={(formData, errors) => {
            errors = validateAll(formData, errors, validateElements);
            return validate?.(formData, errors) ?? errors;
          }}
          ref={ref}
          {...props}
        />;
      } else {
        return <Form config={config} validate={validate} ref={ref} {...props} />;
      }
    }
  )
}
