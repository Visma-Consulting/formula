/* eslint-disable formatjs/no-id */
/* eslint-disable formatjs/enforce-default-message */
import { defineMessages } from '@formatjs/intl';
import { get, mapValues } from 'lodash';
import { useIntl } from 'react-intl';

const messages = defineMessages({
  minItems: {
    defaultMessage: '"{field}" tulee sisältää vähintään {limit} alkiota',
  },
  maxItems: {
    defaultMessage: '"{field}" tulee sisältää korkeintaan {limit} alkiota',
  },
  minLength: {
    defaultMessage:
      '"{field}" {limit, plural, =1 {on pakollinen kenttä} other {tulee sisältää vähintään # merkkiä}}',
  },
  maxLength: {
    defaultMessage:
      '"{field}" {limit, plural, =1 {on pakollinen kenttä} other {tulee sisältää korkeintaan # merkkiä}}',
  },
  enum: {
    defaultMessage: '"{field}" vaatii hyväksynnän',
  },
  minimum: {
    defaultMessage: '"{field}" täytyy olla suurempi tai yhtä suuri kuin {limit}',
  },
  maximum: {
    defaultMessage: '"{field}" täytyy olla pienempi tai yhtä suuri kuin {limit}',
  },

  pattern: { defaultMessage: '"{field}" arvon on oltava {description}' },
  required: { defaultMessage: '"{field}" on pakollinen kenttä' },
  requiredStart: { defaultMessage: '"{field}" alkupäivä on pakollinen kenttä'},
  requiredEnd: { defaultMessage: '"{field}" loppupäivä on pakollinen kenttä'},
  choices: { defaultMessage: 'Valintalistassa tulee olla vähintään yksi vaihtoehto'},
  type: { defaultMessage: '"{field}" tulee olla {type}' },
});

const type = defineMessages({
  file: { defaultMessage: 'valittu' },
  string: { defaultMessage: 'tekstiarvo' },
  number: { defaultMessage: 'numero'},
  boolean: { defaultMessage: 'booleanarvo' },
  array: { defaultMessage: 'taulu' },
});

const params = { type };

export default (props) => {
  const intl = useIntl();

  return {
    ...props,
    transformErrors: (errors) => {
      const transformedErrors = errors.map((error) => {
        const errorName = error.property.includes('.end') ? 'requiredEnd' : error.property.includes('.start') ? 'requiredStart' : error.property.includes('choices') ? 'choices' : error.name;
        const messageDescriptor = messages[errorName];
        if (!messageDescriptor) {
          return error;
        }

        const { schema, uiSchema } = props.__useDynamicElements_original_props__;
        const errorProperty = error.property
          // .properties[0].enum --> [0]
          .replace(/^\.properties/, '')
          .replace(/\.end$/, '')
          .replace(/\.start$/, '')
          .replace(/\.enum$/, '')
          // Array item's array: ['0'][10] --> ['0']
          .replace(/\[\d+\]$/, '');
        const errorPropertyArray = errorProperty
          // remove first character ['0'] --> '0'], .key --> key
          .slice(1)
          // replace ][ with . '0'][1].key -> '0'.1.key
          .replaceAll('[', '.')
          .replaceAll(']', '')
          .split('.');
        const { fieldSchema, fieldUISchema } = errorPropertyArray
          .reduce(
            function accumulator({ fieldSchema = {}, fieldUISchema = {} }, pathPart, index) {
              if (fieldSchema.type === 'object') {
                const itemUiSchema = get(fieldUISchema, `[${pathPart}]`);
                return {
                  fieldSchema: get(fieldSchema.properties, `[${pathPart}]`),
                  fieldUISchema: itemUiSchema?.items?.patternDescription ? itemUiSchema.items : itemUiSchema,
                };
              }
              if (fieldSchema.type === 'array') {
                return accumulator(
                  {
                    fieldSchema: fieldSchema.items,
                    fieldUISchema: fieldUISchema.items,
                  },
                  errorPropertyArray[index + 1]
                );
              }
              return {
                fieldSchema,
                fieldUISchema: fieldUISchema,
              };
            },
            {
              fieldSchema: schema,
              fieldUISchema: uiSchema,
            }
          );
        const title = fieldSchema?.title !== '' ? fieldSchema?.title : (props.config?.labelError !== '' && props.config?.useLabel) ? props.config?.labelError : '';
        const { patternDescription } = fieldUISchema ?? {};
        const message = intl.formatMessage(messageDescriptor, {
          field: title,
          description: { pattern: patternDescription }[errorName],
          ...mapValues(
            mapValues(error.params, stringDataUrlToFile(fieldSchema)),
            (value, key) =>
              key in params && value in params[key]
                ? intl.formatMessage(params[key][value])
                : value
          ),
        });
        return {
          ...error,
          params: { pattern: patternDescription },
          message,
          stack: message,
        };
      });
      return props.transformErrors
        ? props.transformErrors(transformedErrors)
        : transformedErrors;
    },
  };
};

const stringDataUrlToFile = (fieldSchema) => (value) =>
  [fieldSchema?.format, fieldSchema?.items?.format].includes('data-url')
    ? 'file'
    : value;
