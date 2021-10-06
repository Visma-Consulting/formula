import { defineMessage } from 'react-intl';
import extendType from './_extendType';
import _dummy from './_dummy';
import { Typography } from '@material-ui/core';

export default extendType(_dummy, ({ config: { content } }) => (props) => {
  props.uiSchema ??= {};
  props.uiSchema['ui:field'] = () => <Typography variant="h5">{content}</Typography>;
  props.uiSchema['ui:should-update'] = content;
});

export const name = defineMessage({
  defaultMessage: 'Otsikko',
});

export const elementType = 'element';
