import extendType from './_extendType';
import text from './text';

export default extendType(text, ({ config }) => (props) => {
  props.uiSchema ??= {};
  props.uiSchema['ui:widget'] = 'textarea';
});
