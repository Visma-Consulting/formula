import { mapValues, omitBy, pickBy } from 'lodash';
import { useLocalize } from './useLocalize';

export const translateProperties = [
  'title',
  'name',
  'label',
  'default',
  'description',
  'help',
  'patternDescription',
  'placeholder',
  'yes',
  'no',
  'content',
  'successText',
  'enumNames',
  'textDefault'
];

export const translateArrayProperties = ['choices', 'elements'];

export const translateArray = ['tableColumns']

export const isLecacyTranslationObject = (value, key) =>
  typeof value === 'object' && translateProperties.includes(key);

export function useLocalizeConfig() {
  const localize = useLocalize();

  return function localizeConfig(config) {
    const translatedConfig = omitBy(config, isLecacyTranslationObject);
    const translate = pickBy(config, isLecacyTranslationObject);
    if (Object.keys(translate).length) {
      translatedConfig.intl = translate;
    }

    return {
      ...mapValues(translatedConfig, (value, key) =>
        translateArrayProperties.includes(key)
          ? value.map((value) => typeof value === 'object' ? localizeConfig(value) : value)
          : value
      ),
      ...mapValues(translatedConfig, (value, key) =>
        translateArray.includes(key)
          ? value.map((value) => typeof value === 'object' ? localize(value) : value)
          : value
      ),
      ...mapValues(translate, localize),
    };
  };
}
