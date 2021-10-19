import { empty } from '..';
import Field from '../Field';

export default ({ formData, schema, uiSchema }) =>
  formData?.length
    ? formData.map((formData, index) => (
        <Field
          key={index}
          schema={schema.items}
          uiSchema={uiSchema?.items}
          formData={formData}
        />
      ))
    : empty;
