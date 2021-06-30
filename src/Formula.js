import { forwardRef } from 'react';
import RJSFForm from '@visma/rjsf-material-ui';
import { update } from 'lodash/fp';
import useNormalizeConfig from './useNormalizeConfig';
import configToSchemas from './configToSchemas';
import { withFormulaProvider } from './Context';
import withFormConfigLoader from './withFormConfigLoader';
import withFormDataLoader from './withFormDataLoader';
import withConfirmSubmit from './withConfirmSubmit';
import useSubmit from './useSubmit';
import withReview from './withReview';
import useDynamicElements from './useDynamicElements';

const RJSFFormWithPlugins = RJSFForm |> withReview;

function Base(props, ref) {
  props =
    props
    |> useSubmit
    |> update('config', useNormalizeConfig())
    |> useDynamicElements;

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
