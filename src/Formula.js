import { forwardRef } from 'react';
import RJSFForm from '@visma/rjsf-material-ui';
import useForm from './useForm';
import configToSchemas from './configToSchemas';
import { withFormulaProvider } from './Context';
import withFormConfigLoader from './withFormConfigLoader';
import useSubmit from './useSubmit';

function Formula(props, ref) {
  const { config, ...otherProps } = props |> useSubmit;
  const schemaProps = config |> useForm |> configToSchemas;

  return <RJSFForm ref={ref} {...otherProps} {...schemaProps} />;
}

export const Form = Formula |> forwardRef |> withFormConfigLoader;

export default Form |> withFormulaProvider;
