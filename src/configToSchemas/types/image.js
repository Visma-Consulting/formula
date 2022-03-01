import { makeStyles } from '@material-ui/core/styles';
import { defineMessage } from 'react-intl';
import _dummy from './_dummy';
import extendType from './_extendType';

const useStyles = makeStyles({
  root: {
    maxWidth: '100%',
    width: 'fit-content',
  },
});

function Image(props) {
  const { url, altText } = props.uiSchema['ui:options'].element;
  const classes = useStyles();

  return <img src={url} alt={altText} className={classes.root} />;
}

export default extendType(_dummy, ({ config: { altText, url } }) => (props) => {
  props.uiSchema ??= {};
  props.uiSchema['ui:field'] = Image;
  props.uiSchema['ui:should-update'] = `${url}-${altText}`;
});

export const name = defineMessage({
  defaultMessage: 'Kuva',
});

export const elementType = 'element';
