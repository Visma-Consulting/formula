import { setDefaultType } from '../utils';
import convertLegacyTranslationsToIntlProps from './convertLegacyTranslationsToIntlProps';
import { useLocalizeConfig } from '../useLocalizeConfig';

export default ({
  // Optionally disable localizing config – mainly for editor to show original config.
  localize = true,
  // Default to top level form config.
  type = 'form',
} = {}) => {
  const localizeConfig = useLocalizeConfig();
  return (config) =>
    config
    |> setDefaultType(type)
    |> convertLegacyTranslationsToIntlProps
    |> (localize ? localizeConfig : (config) => config);
};
