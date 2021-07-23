import { forwardRef } from 'react';
import invariant from 'tiny-invariant';
import { useFormData } from './api';

export default function withFormDataLoader(Form) {
  const Loader = forwardRef(({ id, rev, dataId, ...other }, ref) => {
    invariant(
      !(dataId && other.formData),
      'You should not use prop `dataId` with `formData`'
    );

    const { values: formData, form } = useFormData(dataId);

    invariant(
      !id || id === form.id,
      'Form data is linked to a different form id. You should not provide `id` with `dataId`'
    );
    invariant(
      !rev || rev === form.rev,
      'Form data is linked to a different form revision. You should not provide `rev` with `dataId`'
    );

    return (
      <Form
        ref={ref}
        {...other}
        formData={formData}
        id={String(form.id)}
        rev={String(form.rev)}
      />
    );
  });

  return forwardRef((props, ref) => {
    const WithFormDataLoader = props.dataId ? Loader : Form;
    return <WithFormDataLoader ref={ref} {...props} />;
  });
}
