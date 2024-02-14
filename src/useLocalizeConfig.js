import { mapValues, omitBy, pickBy } from 'lodash';
import { useCallback } from 'react';
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
  'textDefault',
  'consentTitle',
  'consentMessage',
  'labelError',
  'logoAlt'
];

export const translateArrayProperties = ['choices', 'elements', 'scaleMarks'];

export const translateArray = ['tableColumns', 'rowTitles'];
export const translateCalcArray = ['calcTableColumns'];

export const isLecacyTranslationObject = (value, key) =>
  typeof value === 'object' && translateProperties.includes(key);

export function useLocalizeConfig() {
  const localize = useLocalize();

  return useCallback(
    function localizeConfig(config) {
      const translatedConfig = omitBy(config, isLecacyTranslationObject);
      const translate = pickBy(config, isLecacyTranslationObject);
      // Proposal for translated config values
      // if (Object.keys(translate).length) {
      //   translatedConfig.intl = translate;
      // }

      return {
        ...mapValues(translatedConfig, (value, key) =>
          translateArrayProperties.includes(key)
            ? value?.map((value) =>
                typeof value === 'object' ? localizeConfig(value) : value
              )
            : translateArray.includes(key)
            ? value?.map((value) =>
                typeof value === 'object' ? localize(value) : value
              )
            // TODO calctable: fix this
            // : translateCalcArray.includes(key)
            // ? value?.forEach(col => col.name =
            //       typeof col.name === 'object' ? localize(col.name) : col)
            : value
        ),
        ...mapValues(translate, localize),
      };
    },
    [localize]
  );
}
