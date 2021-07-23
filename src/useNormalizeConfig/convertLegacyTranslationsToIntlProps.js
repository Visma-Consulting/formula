import { mapValues, omitBy, pickBy } from 'lodash';
import {
  isLecacyTranslationObject,
  translateArrayProperties,
} from '../useLocalizeConfig';

export default function convertLegacyTranslationsToIntlProps(config) {
  const translatedConfig = omitBy(config, isLecacyTranslationObject);
  const translate = pickBy(config, isLecacyTranslationObject);
  if (Object.keys(translate).length) {
    translatedConfig.intl = translate;
  }

  return mapValues(translatedConfig, (value, key) =>
    translateArrayProperties.includes(key)
      ? value.map((value) =>
          typeof value === 'object'
            ? convertLegacyTranslationsToIntlProps(value)
            : value
        )
      : value
  );
}
