import { useForm } from './api';

export default function withFormConfigLoader(Component) {
  function FormConfigLoader({ id, ...other }) {
    return <Component {...other} config={useForm(id)} />;
  }

  return function Formula(props) {
    const Formula = props.id ? FormConfigLoader : Component;
    return <Formula {...props} />;
  };
}
