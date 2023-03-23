import { defineMessage } from 'react-intl';
import extendType from './_extendType';
import _dummy from './_dummy';
import { Typography } from '@material-ui/core';

export const SubtitleField = ({ uiSchema }) => {
  const content = uiSchema?.['ui:options']?.element?.content;
  return <Typography component="p" variant="subtitle1">{content}</Typography>
}

export default extendType(_dummy, ({ config: { content, type, ...other } }) => (props) => {
  props.schema.additionalType = type;
  props.uiSchema ??= {};
  props.uiSchema['ui:field'] = SubtitleField;
  props.uiSchema['ui:should-update'] = content;
});

export const name = defineMessage({
  defaultMessage: 'Väliotsikko',
});

export const elementType = 'element';
