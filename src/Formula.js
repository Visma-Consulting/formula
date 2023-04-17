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
import withDraftSave from './withDraftSave';
import withSnackbar from './withSnackbar';
import withFormulaErrorBoundary from './withFormulaErrorBoundary';
import withCustomValidation from './withCustomValidation';
import withScrollToError from './withScrollToError';
import withFillActions from './withFillActions';

/**
 * RJSFForm is extended with these higher-order components. Extensions are
 * added from top to bottom. Props get modified in the reversed order: bottom
 * to top.
 *
 *  - The topmost function is the most inner wrapper component of <RJSFForm>
 *  - The last function is the outmost wrapper. It gets the unmodified props
 *    from the user of <Form>.
 */
export const Form =
  RJSFForm
  |> withPropsUpdater(noHtml5Validate)
  |> withPropsUpdater(omitExtraData)
  |> withPropsUpdater(useFields)
  |> withPropsUpdater(useLocalizeErrors)
  |> withConfirmSubmit
  |> withSteps
  |> withReview
  |> withFillActions
  |> withDraftSave
  |> withPropsUpdater(configToSchemas)
  |> withPropsUpdater(useDynamicElements)
  |> withPrefill
  |> withCustomValidation
  |> withLiveValidateOnError
  |> withPropsUpdater(useNormalizeConfigProp)
  |> withFormConfigLoader
  |> withSnackbar
  |> withScrollToError
  |> withFormulaErrorBoundary;

export const Formula = Form |> withFormulaProvider;
