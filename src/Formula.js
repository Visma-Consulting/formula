import RJSFForm from '@visma/rjsf-material-ui';
import configToSchemas from './configToSchemas';
import { withFormulaProvider } from './Context';
import noHtml5Validate from './noHtml5Validate';
import omitExtraData from './omitExtraData';
import useDynamicElements from './useDynamicElements';
import useFields from './useFields';
import useLocalizeErrors from './useLocalizeErrors';
import { useNormalizeConfigProp } from './useNormalizeConfig';
import { withPropsUpdater } from './utils';
import withConfirmSubmit from './withConfirmSubmit';
import withFormConfigLoader from './withFormConfigLoader';
import withLiveValidateOnError from './withLiveValidateOnError';
import withPrefill from './withPrefill';
import withReview from './withReview';
import withSteps from './withSteps';
import withCustomValidation from './withCustomValidation';

export const Form =
  RJSFForm
  |> withPropsUpdater(noHtml5Validate)
  |> withPropsUpdater(omitExtraData)
  |> withPropsUpdater(useFields)
  |> withPropsUpdater(useLocalizeErrors)
  |> withConfirmSubmit
  |> withSteps
  |> withReview
  |> withPropsUpdater(configToSchemas)
  |> withPropsUpdater(useDynamicElements)
  |> withPrefill
  |> withCustomValidation
  |> withLiveValidateOnError
  |> withPropsUpdater(useNormalizeConfigProp)
  |> withFormConfigLoader;

export const Formula = Form |> withFormulaProvider;
