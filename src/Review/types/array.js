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
      const itemOptions = {
        ...uiSchema?.items?.['ui:options'],
        element: {
          ...uiSchema?.items?.['ui:options']?.element,
          indent: 0}
      }
      return (formData.map((formData, index) => (
        <Field
          {...otherProps}
          key={index}
          schema={schema.items}
          uiSchema={{...uiSchema?.items, 'ui:options': itemOptions}}
          formData={formData}
        />
      )));
    }
  } else {
    return empty;
  }
}
