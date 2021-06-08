import { forwardRef } from 'react';
import invariant from 'tiny-invariant';
import { useFormData } from './api';

export default function withFormDataLoader(Component) {
  const Loader = forwardRef(({ dataId, ...other }, ref) => {
    invariant(
      !(dataId && other.formData),
      'You should not use prop `dataId` with `formData`'
    );

    return (
      <Component ref={ref} {...other} formData={useFormData(dataId).values} />
    );
  });

  return forwardRef((props, ref) => {
    const Formula = props.dataId ? Loader : Component;
    return <Formula ref={ref} {...props} />;
  });
}
