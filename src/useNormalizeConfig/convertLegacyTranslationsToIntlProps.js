import { mapValues, omitBy, pickBy } from 'lodash';

const translateProperties = [
  'title',
  'name',
  'description',
  'help',
  'patternDescription',
  'yes',
  'no',
  'tableColumns',
  'content',
  'successText',
  'enumNames',
];

const isLecacyTranslationObject = (value, key) =>
  typeof value === 'object' && translateProperties.includes(key);

const translateArrayProperties = ['choices', 'elements'];

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
