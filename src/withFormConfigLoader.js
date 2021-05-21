import { forwardRef } from 'react';
import { useFormRaw } from './api';

export default (function withFormConfigLoader(Component) {
  const FormConfigLoader = forwardRef(({ id, ...other }, ref) => (
    <Component ref={ref} {...other} config={useFormRaw(id)} />
  ));

  return forwardRef((props, ref) => {
    const Formula = props.id ? FormConfigLoader : Component;
    return <Formula ref={ref} {...props} />;
  });
});
