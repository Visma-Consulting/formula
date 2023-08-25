import { defineMessage } from 'react-intl';
import Markdown from '../../Markdown';
import extendType from './_extendType';
import _dummy from './_dummy';

export default extendType(_dummy, ({ config: { content, type }}) => (props) => {
  props.schema.additionalType = type;
  props.uiSchema ??= {};
  props.uiSchema['ui:field'] = () => <Markdown>{content}</Markdown>;
  props.uiSchema['ui:should-update'] = content;
});

export const name = defineMessage({
  defaultMessage: 'Leipäteksti',
});

export const elementType = 'element';
