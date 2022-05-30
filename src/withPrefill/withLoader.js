import {forwardRef} from 'react';
import invariant from 'tiny-invariant';
import {useSubmittedFormData} from '../api';

export default function withLoader(Form) {
  const Loader = forwardRef(({id, rev, dataId, credentials, dataIsDraft, ...other}, ref) => {
    invariant(
      !(dataId && other.formData),
      'You should not use prop `dataId` with `formData`'
    );

    const {values: formData, form, dataId: _id} = useSubmittedFormData(id, rev, credentials, dataId, dataIsDraft);

    const formId = String(form.id);
    const formRev = String(form.rev);

    if (/^fm_\d+_\d+$/.test(id)) {
      const formIdOfData = `fm_${formId}_${formRev}`;
      invariant(
        String(id) === formIdOfData,
        'Form data is linked to a different form identifier. You should not provide `id` with `dataId`'
      );
    } else {
      invariant(
        id == null || String(id) === formId,
        'Form data is linked to a different form id. You should not provide `id` with `dataId`'
      );
      invariant(
        rev == null || String(rev) === formRev,
        'Form data is linked to a different form revision. You should not provide `rev` with `dataId`'
      );
    }

    return (
      <Form
        ref={ref}
        {...other}
        formData={formData}
        id={formId}
        rev={formRev}
        dataId={dataId}
        credentials={credentials}
        dataIsDraft={dataIsDraft}
      />
    );
  });

  return forwardRef((props, ref) => {
    const WithFormDataLoader = props.dataId ? Loader : Form;
    return <WithFormDataLoader ref={ref} {...props} />;
  });
}
