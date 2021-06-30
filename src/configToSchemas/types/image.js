import { defineMessage } from 'react-intl';
import extendType from './_extendType';
import _dummy from './_dummy';

export default extendType(_dummy, ({ config: { alt, url } }) => (props) => {
  props.uiSchema ??= {};
  props.uiSchema['ui:field'] = () => <img src={url} alt={alt} />;
  props.uiSchema['ui:should-update'] = url;
});

export const name = defineMessage({
  defaultMessage: 'Kuva',
});

export const elementType = 'element';
