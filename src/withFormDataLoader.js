import { forwardRef } from 'react';
import invariant from 'tiny-invariant';
import { useFormData } from './api';

export default function withFormDataLoader(Form) {
  const Loader = forwardRef(({ dataId, ...other }, ref) => {
    invariant(
      !(dataId && other.formData),
      'You should not use prop `dataId` with `formData`'
    );

    const { values: formData, ...formMetaData } = useFormData(dataId);

    return (
      <Form
        ref={ref}
        {...other}
        formData={formData}
        formMetaData={formMetaData}
      />
    );
  });

  return forwardRef((props, ref) => {
    const WithFormDataLoader = props.dataId ? Loader : Form;
    return <WithFormDataLoader ref={ref} {...props} />;
  });
}
