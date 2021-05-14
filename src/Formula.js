import RJSFForm from '@visma/rjsf-material-ui';
import useForm from './useForm';
import configToSchemas from './configToSchemas';
import { withFormulaProvider } from './Context';
import withFormConfigLoader from './withFormConfigLoader';

function Formula({ config, ...otherProps }) {
  const props = config |> useForm |> configToSchemas;

  return <RJSFForm {...otherProps} {...props} />;
}

export const Form = Formula |> withFormConfigLoader;

export default Form |> withFormulaProvider;
