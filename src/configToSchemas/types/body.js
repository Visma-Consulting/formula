import Markdown from '../../Markdown';
import extendType from './_extendType';
import _dummy from './_dummy';

export default extendType(_dummy, ({ config: { content } }) => (props) => {
  props.uiSchema ??= {};
  props.uiSchema['ui:field'] = () => <Markdown>{content}</Markdown>;
  props.uiSchema['ui:should-update'] = content;
});
