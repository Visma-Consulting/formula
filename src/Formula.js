import RJSFForm from '@visma/rjsf-material-ui';
import configToSchemas from './configToSchemas';
import { withFormulaProvider } from './Context';
import useDynamicElements from './useDynamicElements';
import { useNormalizeConfigProp } from './useNormalizeConfig';
import useSubmit from './useSubmit';
import { withPropsUpdater } from './utils';
import withConfirmSubmit from './withConfirmSubmit';
import withFormConfigLoader from './withFormConfigLoader';
import withFormDataLoader from './withFormDataLoader';
import withReview from './withReview';

export const Form =
  RJSFForm
  |> withPropsUpdater(useSubmit)
  |> withReview
  |> withPropsUpdater(configToSchemas)
  |> withPropsUpdater(useDynamicElements)
  |> withPropsUpdater(useNormalizeConfigProp)
  |> withFormConfigLoader
  |> withFormDataLoader
  |> withConfirmSubmit;

export const Formula = Form |> withFormulaProvider;
