import { mapValues, pick, omit } from 'lodash';

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

const translateArrayProperties = ['choices', 'elements'];

export default function convertLegacyTranslationsToIntlProps(config) {
  const translated = omit(config, translateProperties);
  const translate = pick(config, translateProperties);
  if (Object.keys(translate).length) {
    translated.intl = translate;
  }

  return mapValues(translated, (value, key) =>
    translateArrayProperties.includes(key)
      ? value.map(convertLegacyTranslationsToIntlProps)
      : value
  );
}
