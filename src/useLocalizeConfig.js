import { mapValues } from 'lodash';
import { useLocalize } from './useLocalize';

export default function useLocalizeConfig() {
  const localize = useLocalize();

  return function localizeConfig({ intl, ...other }) {
    return {
      ...mapValues(other, (value, key) =>
        Array.isArray(value) ? value.map(localizeConfig) : value
      ),
      ...mapValues(intl, localize),
    };
  };
}
