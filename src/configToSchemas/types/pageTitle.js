import { defineMessage } from 'react-intl';
import extendType from './_extendType';
import _dummy from './_dummy';

// Used to identify page split points and display only page elements.
export const PageTitle = () => null;

export default extendType(_dummy, ({ config: { content } }) => (props) => {
  props.uiSchema ??= {};
  props.uiSchema['ui:field'] = PageTitle;
  props.uiSchema['ui:title'] = content;
});

export const name = defineMessage({
  defaultMessage: 'Sivuerotin ja otsikko',
});

export const elementType = 'element';
