import extendType from './_extendType';
import text from './text';
import { RichText } from '../../RichText';

export default extendType(text, ({ config }) => (props) => {
  props.uiSchema ??= {};
  props.uiSchema['ui:widget'] = RichText;
});
