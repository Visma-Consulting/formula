import RJSFForm from '@visma/rjsf-material-ui';
import configToSchemas from './configToSchemas';
import { withFormulaProvider } from './Context';
import omitExtraData from './omitExtraData';
import useDynamicElements from './useDynamicElements';
import useFields from './useFields';
import { useNormalizeConfigProp } from './useNormalizeConfig';
import useSubmit from './useSubmit';
import { withPropsUpdater } from './utils';
import withConfirmSubmit from './withConfirmSubmit';
import withFormConfigLoader from './withFormConfigLoader';
import withPrefill from './withPrefill';
import withReview from './withReview';
import withSteps from './withSteps';

export const Form =
  RJSFForm
  |> withPropsUpdater(omitExtraData)
  |> withPropsUpdater(useFields)
  |> withPropsUpdater(useSubmit)
  |> withConfirmSubmit
  |> withSteps
  |> withReview
  |> withPropsUpdater(configToSchemas)
  |> withPropsUpdater(useDynamicElements)
  |> withPrefill
  |> withPropsUpdater(useNormalizeConfigProp)
  |> withFormConfigLoader;

export const Formula = Form |> withFormulaProvider;
