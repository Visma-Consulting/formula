import { flow } from 'lodash';
// import convertLegacyTranslationsToIntlProps from './convertLegacyTranslationsToIntlProps';
import { useLocalizeConfig } from '../useLocalizeConfig';
import { setDefaultType } from '../utils';
import legacyConfigSupport from './legacyConfigSupport';
import maybeSetElements from './maybeSetElements';
import omitNullValues from './omitNullValues';
import setElementDefaultKeys from './setElementDefaultKeys';

const useNormalizeConfig = ({
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
      legacyConfigSupport,
      // If applicable type and elements are not defined.
      maybeSetElements,
      // Use element index as default key.
      setElementDefaultKeys,
      //convertLegacyTranslationsToIntlProps,
      localize && localizeConfig,
    ].filter(Boolean)
  );
};

export default useNormalizeConfig;

export const useNormalizeConfigProp = (props) => ({
  ...props,
  config: useNormalizeConfig()(props.config),
});
