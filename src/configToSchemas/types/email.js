import extendType from './_extendType';
import text from './text';
import { defineMessage } from 'react-intl';

export default extendType(text, ({ config }) => (props) => {
  props.schema ??= {};
  props.schema = {
    ...props.schema,
    pattern: config.required ? '[^\\s]+^$|^(.*@[a-zA-Z0-9]+[a-zA-Z0-9\\.-]*\\.[a-zA-Z0-9]{2,})$' : '^$|^(.*@[a-zA-Z0-9]+[a-zA-Z0-9\\.-]*\\.[a-zA-Z0-9]{2,})$'
  }
  props.uiSchema ??= {};
  props.uiSchema['ui:widget'] = 'email';
});

export const name = defineMessage({
  defaultMessage: 'Sähköpostiosoite',
});

export const elementType = 'field';
