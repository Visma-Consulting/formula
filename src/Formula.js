import RJSFForm from '@visma/rjsf-material-ui';
import useForm from './useForm';
import configToSchemas from './configToSchemas';
import { withFormulaProvider } from './Context';
import withFormConfigLoader from './withFormConfigLoader';
import useSubmit from './useSubmit';

function Formula(props) {
  const { config, ...otherProps } = props |> useSubmit;
  const schemaProps = config |> useForm |> configToSchemas;

  return <RJSFForm {...otherProps} {...schemaProps} />;
}

export const Form = Formula |> withFormConfigLoader;

export default Form |> withFormulaProvider;
