import { defineMessage, useIntl } from 'react-intl';
import { utils } from '@visma/rjsf-core';
import { useContext, useEffect } from 'react';
import { useFields } from '../../api';
import sift from 'sift';

const getRepeatableFormgroupElementKeys = (formdata, originalElements) => {
  const elementKeys = [];
  const formDataKeys = Object.keys(formdata ?? {});
  formDataKeys.forEach(key => {
    const element = originalElements.find(el => el.key === key);
    if (element
      && (!element.filter?.show
        || (element.filter?.show?.query && sift(element.filter.show.query)(formdata)))) {
      elementKeys.push(key);
    }
  });
  return elementKeys;
}

const getUsableFormData = (id, element, rootSchema, formData) => {
  if (element.containingFormgroup) {
    for (const key of Object.keys(rootSchema?.properties ?? {})) {
      const formgroupConfig = rootSchema.properties[key];
      if (formgroupConfig.items && formgroupConfig.items.originalConfig?.id === element.containingFormgroup) {
        const data = formData[key][id.substring(key.length + 6).split('_')[0]];
        return {
          usableFormData: data,
          existingDataKeys: getRepeatableFormgroupElementKeys(data, formgroupConfig.items.originalConfig.elements)
        };
      } else if (formgroupConfig?.originalConfig?.id === element.containingFormgroup) {
        return {
          usableFormData: formData[key],
          existingDataKeys: Object.keys(formgroupConfig?.properties)
        };
      }
    }
  }

  return {usableFormData: formData, existingDataKeys: Object.keys(rootSchema?.properties ?? {})};
}

function Compose(props) {
  const intl = useIntl();
  const { formData } = useContext(utils.Context);
  const fields = useFields();
  const element = props.uiSchema?.['ui:options']?.element;
  const {usableFormData, existingDataKeys} = getUsableFormData(props.id, element, props.registry?.rootSchema, formData);

  useEffect(() => {
    const { values, separator } = props.options;

    const composedField = values
      .map(value => {
        const [key, id] = value ? value.split('.') : ['error', 'error'];
        return key === 'error' ? { value: undefined } : {
          value: usableFormData?.[key],
          key: key,
          id: parseInt(id)
        }
      })
      .filter(data => data.value !== undefined)
      .map(function getStringValue(data) {
        const field = fields.find(field => field._id === data.id);
        if (!field || !existingDataKeys.includes(data.key)) { return undefined }
        if (Array.isArray(data.value)) {
          const listValue = data.value.map(dataValue => {
            return getStringValue({...data, value: dataValue})
          });
          return listValue.length > 0 ? listValue.join(separator) : undefined;
        } else {
          switch (field.type) {
            case 'select': case 'multiselect':
              const choice = field.choices.find(choice => choice.enum === data.value) ?? field.choices[data.value];
              return choice?.enumNames ?? data.value;
            case 'boolean':
              if (data.value) {
                return field.yes && field.yes !== '' ? field.yes : intl.formatMessage({defaultMessage: 'Kyllä'});
              } else {
                return field.no && field.no !== '' ? field.no : intl.formatMessage({defaultMessage: 'Ei'});
              }
            case 'consent':
              if (data.value) {
                return field.yes && field.yes !== '' ? field.yes : intl.formatMessage({defaultMessage: 'Hyväksyn'});
              } else {
                return undefined;
              }
            case 'dateRange':
              return `${data.value.start ?? ''} - ${data.value.end ?? ''}`;
            case 'confirmField':
              return data?.value?.value;
            case 'text': case 'textarea': case 'richtext': case 'email':
            case 'number':case 'password': case 'range': case 'bmi': case 'date':
              return data.value;
            default:
              return undefined;
          }
        }
      })
      .filter(data => data !== undefined)
      .join(separator);

    setTimeout(() => {
      props.onChange(composedField);
    });
  }, [usableFormData, props.options, formData, fields])

  return null;
}

export default (props) => {
  const {
    config: { composeValues = [], composeSeparator = '', type },
  } = props;
  return {
    schema: {
      type: 'string',
      additionalType: type
    },
    uiSchema: {
      'ui:widget': Compose,
      'ui:options': {
        values: composeValues,
        separator: composeSeparator
      },
    },
  };
};

export const name = defineMessage({
  defaultMessage: 'Koottu kenttä',
});

export const elementType = 'element';
