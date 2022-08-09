import { empty } from '..';
import Field from '../Field';

export default ({ formData, schema, uiSchema, ...otherProps }) => {
  if (formData?.length) {
    if (uiSchema?.['ui:options']?.inline) {
      return (<Field
        {...otherProps}
        schema={{...(schema.items), inline: true}}
        uiSchema={uiSchema?.items}
        formData={formData}
      />)
    } else {
      return (formData.map((formData, index) => (
        <Field
          {...otherProps}
          key={index}
          schema={schema.items}
          uiSchema={uiSchema?.items}
          formData={formData}
        />
      )));
    }
  } else {
    return empty;
  }
}
