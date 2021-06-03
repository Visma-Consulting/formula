import { mapValues } from 'lodash';
import { useLocalize } from './useLocalize';

export function useLocalizeConfig() {
  const localize = useLocalize();

  return function localizeConfig({ intl, ...other }) {
    return {
      ...mapValues(other, (value, key) =>
        Array.isArray(value)
          ? value.map((value) =>
              typeof value === 'object' ? localizeConfig(value) : value
            )
          : value
      ),
      ...mapValues(intl, localize),
    };
  };
}
