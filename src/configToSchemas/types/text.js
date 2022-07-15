import { defineMessage, useIntl } from 'react-intl';
import { defineMessages } from '@formatjs/intl';

export default ({ config }) => {
  const {
    default: defaults,
    maxLength,
    pattern,
    required,
  } = config;
  const intl = useIntl();
  const patternDescription = config.patternDescription ? config.patternDescription : intl.formatMessage({ defaultMessage: 'muu kuin tyhjä' });
  return {
    schema: {
      default: defaults,
      minLength: (pattern === undefined || pattern === '') ? undefined : 1,
      maxLength,
      pattern: (pattern === undefined || pattern === '' ? undefined : pattern) ?? (required ? '[^\\s]+' : undefined),
      type: 'string',
    },
    uiSchema: { patternDescription },
  };
};

const validationMessages = defineMessages({
  hetuError: {
    defaultMessage: `"{title}" on virheellinen henkilöturvatunnus.`
  }
});

export const validators = {
  hetu: {
    name: defineMessage({
      defaultMessage: 'Henkilötunnus'
    }),
    fn: (value, element) => {
      /*
      Henkilötunnus on muotoa PPKKVVSNNNT, jossa
      PPKKVV on henkilön syntymäpäivä
      S on vuosisataa esittävä merkki: +, - tai A
      NNN on yksilönumero väliltä 002-899 (tai 900-999 väliaikaisille hetuille), parillinen nainen ja pariton mies
      T on tarkiste, joka lasketaan jakamalla PPKKVVNNN syntyvä luku luvulla 31
       */

      if (value) {
        const tArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        'A', 'B', 'C', 'D', 'E', 'F', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R',
        'S', 'T', 'U', 'V', 'W', 'X', 'Y'];

        if (value.length !== 11) {
          // Väärän pituinen
          return validationMessages.hetuError;
        }

        const decade = value[6];

        if (!['+', '-', 'A'].includes(decade)) {
          // Väärä vuosisataa esittävä merkki
          return validationMessages.hetuError;
        }

        const dateString = `${decade === '+' ? 18 : decade === '-' ? 19 : 20}${value.slice(4,6)}-${value.slice(2,4)}-${value.slice(0,2)}`
        const date = new Date(dateString);

        if (isNaN(date.getTime()) || dateString !== date.toISOString().slice(0,10)) {
          // Päivämäärä ei ole validi
          return validationMessages.hetuError;
        }

        const personalNumber = value.slice(7, 10);

        if (isNaN(personalNumber) || parseInt(personalNumber) > 999 || parseInt(personalNumber) < 2) {
          // Yksilönumero ei ole validi
          return validationMessages.hetuError;
        }

        const tCheckString = value.slice(0, 6) + value.slice(7, 10);

        if (isNaN(tCheckString) || tArray[parseInt(tCheckString) % 31] !== value[10]) {
          // Tarkiste ei ole oikea
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
