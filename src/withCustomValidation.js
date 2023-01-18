import { forwardRef } from 'react';
import { validators as textValidators } from './configToSchemas/types/text';
import { validators as tableFieldValidators } from './configToSchemas/types/tableField';
import { validators as formGroupValidators } from './configToSchemas/typePlugins/formGroupList';
import { useIntl } from 'react-intl';

const elementHasValidator = (element) => {
  return element.validator && element.validator !== 'none'
}

export default function withCustomValidation(Form) {
  return forwardRef(
    ({ config, validate, ...props }, ref) => {
      const intl = useIntl();
      const formType = config.type;
      const validateElements = (formType === 'form' || formType === 'formGroup' ? config.elements : [config])
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
          tableField: tableFieldValidators,
          formGroup: formGroupValidators
        }

        const validateOne = (formData, errors, element, listIndex) => {
          const { key, type, validator, useLabel, label, labelError, title } = element;
          const errorMessage = validateFunctions[type]?.[validator]?.fn?.(formData, element);
          if (errorMessage) {
            const elementTitle = useLabel ? (label === "" ? labelError : label) : title;
            const formattedErrorMessage = intl.formatMessage(errorMessage, {...element, title: elementTitle});
            if (key) {
              if (listIndex !== undefined) {
                errors?.[key]?.[listIndex]?.addError(formattedErrorMessage);
              } else {
                errors?.[key]?.addError(formattedErrorMessage);
              }
            } else {
              if (listIndex !== null && listIndex !== undefined) {
                errors?.[listIndex]?.addError(formattedErrorMessage);
              } else {
                errors?.addError(formattedErrorMessage);
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
              } else if(formData){
                validateOne(formData[key], errors, element);
              }
            }
          }
        }

        const validateForm = (formData, errors, elements) => {
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

        const validateAll = (formData, errors, elements) => {
          switch (formType) {
            case 'form':
              return validateForm(formData, errors, elements);
            case 'formGroup':
              return config.list ?
                validateForm({0: formData}, {0: errors}, [{...config, key: 0, elements}]) :
                validateForm(formData, errors, elements);
            default:
              return validateForm({0: formData}, errors, [{...elements[0], key: 0}]);
          }
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
