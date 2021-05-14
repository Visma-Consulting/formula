import { useFormRaw } from './api';

export default function withFormConfigLoader(Component) {
  function FormConfigLoader({ id, ...other }) {
    return <Component {...other} config={useFormRaw(id)} />;
  }

  return function Formula(props) {
    const Formula = props.id ? FormConfigLoader : Component;
    return <Formula {...props} />;
  };
}
