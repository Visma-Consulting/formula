import useResolveElementReferences from './useResolveElementReferences';
import convertLegacyTranslationsToIntlProps from './convertLegacyTranslationsToIntlProps';
import useLocalizeConfig from './useLocalizeConfig';

export default (config) =>
  config
  |> useResolveElementReferences()
  |> convertLegacyTranslationsToIntlProps
  |> useLocalizeConfig();
