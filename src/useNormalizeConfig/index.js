import { setDefaultType } from '../utils';
import omitNullValues from './omitNullValues';
// import convertLegacyTranslationsToIntlProps from './convertLegacyTranslationsToIntlProps';
import { useLocalizeConfig } from '../useLocalizeConfig';
import { flow } from 'lodash';
import maybeSetElements from './maybeSetElements';
import setElementDefaultKeys from './setElementDefaultKeys';

export default ({
  // Optionally disable localizing config – mainly for editor to show original config.
  localize = true,
  // Default to top level form config.
  type = 'form',
} = {}) => {
  const localizeConfig = useLocalizeConfig();

  return flow(
    [
      // Remove possible null values, to make default function parameters to be
      // affective.
      omitNullValues,
      setDefaultType(type),
      // If applicable type and elements are not defined.
      maybeSetElements,
      // Use element index as default key.
      setElementDefaultKeys,
      //convertLegacyTranslationsToIntlProps,
      localize && localizeConfig,
    ].filter(Boolean)
  );
};
