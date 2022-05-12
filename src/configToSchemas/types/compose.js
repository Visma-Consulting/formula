import { defineMessage, useIntl } from 'react-intl';
import { utils } from '@visma/rjsf-core';
import { useContext } from 'react';
import { useFields } from '../../api';

function Compose(props) {
  const intl = useIntl();
  const { formData } = useContext(utils.Context);
  const { values, separator } = props.options;
  const fields = useFields();

  const composedField = values
    .map(value => {
      const [key, id] = value ? value.split('.') : ['error', 'error'];
      return key === 'error' ? { value: undefined } : {
        value: formData[key],
        key: key,
        id: parseInt(id)
      }
    })
    .filter(data => data.value !== undefined)
    .map(function getStringValue(data) {
      const field = fields.find(field => field._id === data.id);
      if (!field) { return undefined }
      if (Array.isArray(data.value)) {
        const listValue = data.value.map(dataValue => {
          return getStringValue({...data, value: dataValue})
        });
        return listValue.length > 0 ? listValue.join(separator) : undefined;
      } else {
        switch (field.type) {
          case 'select': case 'multiselect':
            const choice = field.choices.find(choice => choice.enum === data.value) ?? field.choices[data.value];
            return choice.enumNames ?? data.value;
          case 'boolean':
            if (data.value) {
              return field.yes && field.yes !== '' ? field.yes : intl.formatMessage({defaultMessage: 'Kyllä'});
            } else {
              return field.no && field.no !== '' ? field.no : intl.formatMessage({defaultMessage: 'Ei'});
            }
          case 'text': case 'textarea': case 'email': case 'number': case 'password': case 'range': case 'date':
            return data.value;
          default:
            return undefined;
        }
      }
    })
    .filter(data => data !== undefined)
    .join(separator);

  return (<p>
    {composedField}
  </p>);
}

export default (props) => {
  const {
    config: { values = [], separator = '' },
  } = props;
  return {
    schema: {
      type: 'string',
    },
    uiSchema: {
      'ui:widget': Compose,
      'ui:options': {
        values,
        separator
      },
    },
  };
};

export const name = defineMessage({
  defaultMessage: 'Koottu kenttä',
});

export const elementType = 'element';
