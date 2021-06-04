import { setDefaultType } from '../utils';
import convertLegacyTranslationsToIntlProps from './convertLegacyTranslationsToIntlProps';
import { useLocalizeConfig } from '../useLocalizeConfig';
import { flow } from 'lodash';
import maybeSetElements from './maybeSetElements';

export default ({
  // Optionally disable localizing config – mainly for editor to show original config.
  localize = true,
  // Default to top level form config.
  type = 'form',
} = {}) => {
  const localizeConfig = useLocalizeConfig();

  return flow(
    [
      setDefaultType(type),
      maybeSetElements,
      convertLegacyTranslationsToIntlProps,
      localize && localizeConfig,
    ].filter(Boolean)
  );
};
