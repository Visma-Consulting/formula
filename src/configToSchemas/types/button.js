import { defineMessage } from 'react-intl';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import extendType from './_extendType';
import _dummy from './_dummy';
import { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  button: {
    marginBottom: '15px',
  },
}));

function ButtonWidget(props) {
  const classes = useStyles();
  const {options, onChange} = props;
  const [value, setValue] = useState(props.value);
  const successText = options.element?.meta?.buttonActionProps?.successText;
  const buttonText = options?.element?.useLabel ? options?.element?.label : options?.element?.title
  const onClickAction = props.schema?.buttonActions && props.schema?.buttonActions[options.element?.meta?.buttonOnClickAction];
  const onClick = async() => {
    if(onClickAction) {
      const response = onClickAction && await onClickAction(options.element?.meta?.buttonActionProps)
      if (response === true) {
        setValue(true);
      }
    } else if (options.element.onClickAction) {
      const buttonId = props.id
      options?.element?.onClickAction(buttonId);
    }
  }

  useEffect(() => {
    setTimeout(() => { onChange(value) })
  }, [value]);

  return (
    <div>
      {(value === true && successText) ? <Typography>{successText}</Typography> :
        <Button
          variant="contained"
          color="Primary"
          size={"small"}
          value={value}
          disabled={props?.schema?.disabled}
          className={classes.button}
          onClick={onClick}
        >
          {buttonText}
        </Button> }
    </div>
  );
}

export default extendType(_dummy,(props) => () => ({
  schema: {
    type: 'boolean',
    ...(props.buttonActions === undefined ? { default: false} : undefined),
    buttonActions: props.buttonActions,
    disabled: props?.fillProps?.disableElementButtons
  },
  uiSchema: {
    'ui:widget': ButtonWidget,
  }
}));

export const name = defineMessage({
  defaultMessage: 'Nappi',
});

export const elementType = 'field';
