import { defineMessage, useIntl } from 'react-intl';
import { defineMessages } from '@formatjs/intl';

export default ({ config }) => {
  const {
    default: defaults,
    minLength,
    maxLength,
    pattern,
    required,
  } = config;
  const intl = useIntl();
  const patternDescription = config.patternDescription ? config.patternDescription : intl.formatMessage({ defaultMessage: 'muu kuin tyhjä' });
  return {
    schema: {
      default: defaults,
      minLength: minLength ?? (required ? 1 : undefined),
      maxLength,
      pattern: pattern ?? (required ? '[^\\s]+' : undefined),
      type: 'string',
    },
    uiSchema: { patternDescription },
  };
};

const validationMessages = defineMessages({
  hetuError: {
    defaultMessage: `"{title}" on virheellinen henkilötunnus.`
  }
});

export const validators = {
  hetu: {
    name: defineMessage({
      defaultMessage: 'Hetu'
    }),
    fn: (value, element) => {
      /*
      Henkilötunnus on muotoa PPKKVVSNNNT, jossa
      PPKKVV on henkilön syntymäpäivä
      S on vuosisataa esittävä merkki: +, - tai A
      NNN on yksilönumero väliltä 002-899, parillinen nainen ja pariton mies
      T on tarkiste, joka lasketaan jakamalla PPKKVVNNN syntyvä luku luvulla 31
       */

      if (value) {
        if (value.includes('aaa')) {
          return validationMessages.hetuError;
        }

        if (value.length !== 11) {
          // Väärän pituinen
          return validationMessages.hetuError;
        }

        if (false) {
          // Päivämäärä ei ole validi
          return validationMessages.hetuError;
        }

        if (!['+', '-', 'A'].includes(value[6])) {
          // Väärä vuosisataa esittävä merkki
          return validationMessages.hetuError;
        }
      }
    }
  }
};

export const name = defineMessage({
  defaultMessage: 'Tekstikenttä',
});

export const elementType = 'field';
