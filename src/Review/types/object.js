import Field from '../Field';

export default ({ formData, schema, uiSchema }) =>
  uiSchema['ui:order'].map((name) => (
    <Field
      key={name}
      formData={formData?.[name]}
      schema={schema.properties[name]}
      uiSchema={uiSchema?.[name]}
    />
  ));
