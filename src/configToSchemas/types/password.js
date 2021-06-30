import extendType from './_extendType';
import text from './text';
import { defineMessage } from 'react-intl';

export default extendType(text, ({ config }) => (props) => {
  props.uiSchema ??= {};
  props.uiSchema['ui:widget'] = 'password';
});

export const name = defineMessage({
  defaultMessage: 'Salasana',
});

export const showInEditor = true;
