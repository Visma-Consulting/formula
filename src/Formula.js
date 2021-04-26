import RJSFForm from '@visma/rjsf-material-ui';
import useResolveElementReferences from './useResolveElementReferences';
import convertLegacyTranslationsToIntlProps from './convertLegacyTranslationsToIntlProps';
import useLocalizeConfig from './useLocalizeConfig';
import configToSchemas from './configToSchemas';
import { withFormulaProvider } from './Context';
import withFormConfigLoader from './withFormConfigLoader';

function Formula({ config }) {
  const props =
    config
    |> useResolveElementReferences()
    |> convertLegacyTranslationsToIntlProps
    |> useLocalizeConfig()
    |> configToSchemas;

  return <RJSFForm {...props} />;
}

export const Form = Formula |> withFormConfigLoader;

export default Form |> withFormulaProvider;
