import { freeze } from 'immer';
import configToSchemas from '..';
import { dynamicElements } from '../../useDynamicElements';
import { defineMessages } from '@formatjs/intl';

export const types = ['formGroup'];

//https://github.com/rjsf-team/react-jsonschema-form/issues/1206
function FormGroupListField(props) {
  const schemas = configToSchemas({
    extraTypes: props.uiSchema['ui:options'].formulaProps.extraTypes,
    extraTypePlugins:
      props.uiSchema['ui:options'].formulaProps.extraTypePlugins,
    config: dynamicElements(
      {
        ...props.uiSchema['ui:options'].element,
        list: false,
        title: undefined,
      },
      props.formData
    ),
  });

  const SchemaField = props.registry.fields.SchemaField;

  return <SchemaField {...props} {...schemas} />;
}

export const converter = (formulaProps) => (props) => {
  const { config } = formulaProps;
  if (config.list) {
    props.uiSchema['ui:field'] = FormGroupListField;
    props.uiSchema['ui:options'] ??= {};
    props.uiSchema['ui:options'].formulaProps = freeze(formulaProps);
  }
};

const validationMessages = defineMessages({
  duplicateKey: {
    defaultMessage: `"{title}" ei saa sisältää samaa avainta kahdesti.`
  },
  missingKey: {
    defaultMessage: `"{title}" ei saa sisältää alkioita, joilla ei ole avainta.`
  }
});

export const validators = {
  noDuplicateEnums: {
    name: "Ei duplikaattiavaimia",
    fn: (value, element) => {
      if (value && Object.keys(value)?.length > 0) {
        const usedEnums = []
        const keys = Object.keys(value);
        for (const key of keys) {
          const valueEnum = value[key].enum;
          if (valueEnum === undefined || valueEnum === "") {
            return validationMessages.missingKey;
          } else if (usedEnums.includes(valueEnum)) {
            return validationMessages.duplicateKey;
          } else {
            usedEnums.push(valueEnum);
          }
        }
      }
    }
  }
}
