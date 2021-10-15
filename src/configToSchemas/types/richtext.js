import extendType from './_extendType';
import text from './text';
import { RichText } from '../../RichText';
import { defineMessage } from 'react-intl';

export default extendType(text, ({ config }) => (props) => {
  props.uiSchema ??= {};
  props.uiSchema['ui:widget'] = RichText;
  props.schema['format'] = 'markdown';
});

export const name = defineMessage({
  defaultMessage: 'Rikastettu tekstikenttä',
});

export const elementType = 'field';
