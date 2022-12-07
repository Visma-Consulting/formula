import { defineMessage } from 'react-intl';
import extendType from './_extendType';
import _dummy from './_dummy';
import { Typography } from '@material-ui/core';

export const TitleField = ({ idSchema, uiSchema }) => {
  const content = uiSchema?.['ui:options']?.element?.content;
  const headerNumber = idSchema?.$id?.split('_').length + 1;
  return <Typography component={headerNumber < 5 ? `h${headerNumber}` : 'h6'} variant="h5">{content}</Typography>
}

export default extendType(_dummy, ({ config: { content, ...other } }) => (props) => {
  props.uiSchema ??= {};
  props.uiSchema['ui:field'] = TitleField;
  props.uiSchema['ui:should-update'] = content;
});

export const name = defineMessage({
  defaultMessage: 'Otsikko',
});

export const elementType = 'element';
