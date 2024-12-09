import { flow } from 'lodash';
import { useCallback, useMemo } from 'react';
// import convertLegacyTranslationsToIntlProps from './convertLegacyTranslationsToIntlProps';
import { useLocalizeConfig } from '../useLocalizeConfig';
import { setDefaultType } from '../utils';
import legacyConfigSupport from './legacyConfigSupport';
import maybeSetElements from './maybeSetElements';
import omitNullValues from './omitNullValues';
import setElementDefaultKeys from './setElementDefaultKeys';

const useNormalizeConfig_ = ({
  // Optionally disable localizing config – mainly for editor to show original config.
  localize = true,
  // Default to top level form config.
  type = 'form',
  languages = []
} = {}) => {
  const localizeConfig = useLocalizeConfig(languages);

  return useCallback(
    (config) =>
      flow(
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
      )(config),
    [localize, localizeConfig, type]
  );
};

const useNormalizeConfig = (options) =>
  function useNormalizeConfig(config) {
    const normalize = useNormalizeConfig_({...options, languages: config?.meta?.languages});
    return useMemo(() => normalize(config), [config, normalize]);
  };

export default useNormalizeConfig;

export const useNormalizeConfigProp = (props) => ({
  ...props,
  config: useNormalizeConfig()(props.config),
});

export const useNormalizeConfigs = (options) =>
  function useNormalizeConfigs(configs) {
    const normalize = useNormalizeConfig_(options);
    return useMemo(() => {
      return configs.map(normalize);
    }, [configs, normalize]);
  };
