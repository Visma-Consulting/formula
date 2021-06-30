import extendType from './_extendType';
import number from './number';
import { defineMessage } from 'react-intl';

export default extendType(number, ({ config }) => (props) => {
  props.uiSchema ??= {};
  props.uiSchema['ui:widget'] = 'range';
});

export const name = defineMessage({
  defaultMessage: 'Liukusäädin',
});

export const showInEditor = true;
