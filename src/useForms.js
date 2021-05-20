import convertLegacyTranslationsToIntlProps from './convertLegacyTranslationsToIntlProps';
import useLocalizeConfig from './useLocalizeConfig';

export default (configs) => {
  const localize = useLocalizeConfig();

  return configs.map(
    (config) => config |> convertLegacyTranslationsToIntlProps |> localize
  );
};
