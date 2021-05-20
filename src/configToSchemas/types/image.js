import extendType from './_extendType';
import _dummy from './_dummy';

export default extendType(_dummy, ({ alt, url }) => (props) => {
  props.uiSchema ??= {};
  props.uiSchema['ui:field'] = () => <img src={url} alt={alt} />;
  props.uiSchema['ui:should-update'] = url;
});
