import extendType from './_extendType';
import number from './number';

export default extendType(number, ({ config }) => (props) => {
  props.uiSchema ??= {};
  props.uiSchema['ui:widget'] = 'range';
});
