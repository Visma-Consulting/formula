import { defineMessage, FormattedMessage, useIntl } from 'react-intl';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import extendType from './_extendType';
import _dummy from './_dummy';

const useStyles = makeStyles((theme) => ({
  button: {
    marginBottom: '15px',
  },
}));

function ButtonWidget(props) {
  const classes = useStyles();
  const {options} = props;
  const buttonText = options?.element?.useLabel ? options?.element?.label : options?.element?.title

  const onClickAction = props.schema?.buttonActions && props.schema?.buttonActions[options.element?.meta?.buttonOnClickAction];
  console.log(props);
  return (
    <div>
      <Button
        variant="contained"
        color="Primary"
        size={"small"}
        className={classes.button}
        onClick={() => onClickAction && onClickAction(options.element?.meta?.buttonActionProps)}
      >
        {buttonText}
      </Button>
    </div>
  );
}

export default extendType(_dummy,(props) => () => ({
  schema: {
    type: 'string',
    ...(props.buttonActions === undefined ? { default: ''} : undefined),
    buttonActions: props.buttonActions,
  },
  uiSchema: {
    'ui:widget': ButtonWidget,
  }
}));

export const name = defineMessage({
  defaultMessage: 'Nappi',
});

export const elementType = 'field';
