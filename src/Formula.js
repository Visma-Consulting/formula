import { forwardRef } from 'react';
import RJSFForm from '@visma/rjsf-material-ui';
import useNormalizeConfig from './useNormalizeConfig';
import configToSchemas from './configToSchemas';
import { withFormulaProvider } from './Context';
import withFormConfigLoader from './withFormConfigLoader';
import useSubmit from './useSubmit';

function Base(props, ref) {
  const { config, ...otherProps } = props |> useSubmit;
  const schemaProps = config |> useNormalizeConfig() |> configToSchemas;

  return <RJSFForm ref={ref} {...otherProps} {...schemaProps} />;
}

export const Form = Base |> forwardRef |> withFormConfigLoader;

export const Formula = Form |> withFormulaProvider;
