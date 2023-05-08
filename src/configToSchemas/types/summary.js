import { defineMessage } from 'react-intl';
import extendType from './_extendType';
import _dummy from './_dummy';

export default extendType(_dummy, ({ config: { content, type }}) => (props) => {
  props.schema.additionalType = type;
  props.uiSchema ??= {};
  props.uiSchema['ui:field'] = () => null;
  props.uiSchema['ui:should-update'] = content;
  props.uiSchema['ui:widget'] = 'hidden';
});

export const name = defineMessage({
  defaultMessage: 'Yhteenveto',
});

export const elementType = 'element';
