import { defineMessage, useIntl } from 'react-intl';
import { defineMessages } from '@formatjs/intl';

export default ({ config }) => {
  const {
    default: defaults,
    maxLength,
    pattern,
    required,
    type
  } = config;
  const intl = useIntl();
  const patternDescription = config.patternDescription ? config.patternDescription :
    type === 'email' ? intl.formatMessage({ defaultMessage: 'kelvollinen sähköpostiosoite' }) : intl.formatMessage({ defaultMessage: 'muu kuin tyhjä' });
  return {
    schema: {
      default: defaults,
      minLength: (pattern === undefined || pattern === '') ? undefined : required ? 1 : undefined,
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
  },
  ytunnusError: {
    defaultMessage: `"{title}" on virheellinen Y-tunnus.`
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

        const decadeArray = ['+', '-', 'Y', 'X', 'W', 'V', 'U', 'A', 'B', 'C', 'D', 'E', 'F'];

        if (value.length !== 11) {
          // Väärän pituinen
          return validationMessages.hetuError;
        }

        const decade = value[6];

        if (!decadeArray.includes(decade)) {
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
  },
  ytunnus: {
    name: defineMessage({
      defaultMessage: 'Y-tunnus'
    }),
    fn: (value, element) => {
      /*
      Y-tunnus on muotoa NNNNNNN-T, jossa N luku 0-9 ja T varmistusnumero
      N lukuja voi olla seitsemän tai kuusi, jos lukuja on kuusi eteen lisätään 0
      N luvuista otetaan painotettu tulo ja se jaetaan luvulla 11
      Jakojäännös määrää varmistusnumeron T, T ei voi olla 1
       */

      if (value && value.length > 0) {
        const pattern = /^\d{6,7}-\d$/;

        // Y-tunnuksen täytyy olla muoto NNNNNNN-T tai NNNNNN-T
        if (!pattern.test(value)) {
          return validationMessages.ytunnusError;
        }

        const [identificationNumbers, controlNumber] = value.split('-');

        const identification = identificationNumbers.length === 6 ? `0${identificationNumbers}` : identificationNumbers;
        const control = Number.parseInt(controlNumber);

        // Lasketaan painotettu summa
        const sum = 7 * Number.parseInt(identification[0]) +
          9 * Number.parseInt(identification[1]) +
          10 * Number.parseInt(identification[2]) +
          5 * Number.parseInt(identification[3]) +
          8 * Number.parseInt(identification[4]) +
          4 * Number.parseInt(identification[5]) +
          2 * Number.parseInt(identification[6]);

        // Jakojäännös
        const remainder = sum % 11;

        // Jakojäännös ei saa olla 1.
        if (remainder === 1) {
          return validationMessages.ytunnusError;
        }

        // Jos jakojäännös on 0, tunnistenumeron pitää olla nolla, muussa tapauksessa 11 - jakojäännös
        const compareControl = remainder === 0 ? 0 : 11 - remainder;

        // tunnistenumeroiden pitää olla samat
        if (compareControl !== control) {
          return validationMessages.ytunnusError;
        }
      }
    }
  }
};

export const name = defineMessage({
  defaultMessage: 'Tekstikenttä',
});

export const elementType = 'field';
