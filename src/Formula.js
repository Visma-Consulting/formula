import { forwardRef } from 'react';
import RJSFForm from '@visma/rjsf-material-ui';
import useNormalizeConfig from './useNormalizeConfig';
import configToSchemas from './configToSchemas';
import { withFormulaProvider } from './Context';
import withFormConfigLoader from './withFormConfigLoader';
import withFormDataLoader from './withFormDataLoader';
import withConfirmSubmit from './withConfirmSubmit';
import useSubmit from './useSubmit';
import { update } from 'lodash/fp';

function Base(props, ref) {
  return (
    <RJSFForm
      ref={ref}
      {...(props
        |> useSubmit
        |> update('config', useNormalizeConfig())
        |> configToSchemas)}
    />
  );
}

export const Form =
  Base
  |> forwardRef
  |> withFormConfigLoader
  |> withFormDataLoader
  |> withConfirmSubmit;

export const Formula = Form |> withFormulaProvider;
