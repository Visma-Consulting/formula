import { freeze } from 'immer';
import configToSchemas from '..';
import { dynamicElements } from '../../useDynamicElements';

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
