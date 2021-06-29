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
import withReview from './withReview';

const RJSFFormWithPlugins = RJSFForm |> withReview;

function Base(props, ref) {
  props = props |> useSubmit |> update('config', useNormalizeConfig());

  return (
    <RJSFFormWithPlugins
      ref={ref}
      formulaProps={props}
      {...(props |> configToSchemas)}
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
