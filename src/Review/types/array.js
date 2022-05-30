import { empty } from '..';
import Field from '../Field';

export default ({ formData, schema, uiSchema, ...otherProps }) =>
  formData?.length
    ? formData.map((formData, index) => (
        <Field
          {...otherProps}
          key={index}
          schema={schema.items}
          uiSchema={uiSchema?.items}
          formData={formData}
        />
      ))
    : empty;
