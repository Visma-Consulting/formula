import { forwardRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormattedMessage } from 'react-intl';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    '& > *': {
      marginRight: theme.spacing(1),
      '@media print': {
        display: 'none',
      },
    },
  },
}));

export default function withFillActions(Form) {
  return forwardRef(({fillProps, customMessages, ...otherProps}, ref) => {
    const classes = useStyles();
    if (fillProps?.actions) {
      return (
        <Form ref={ref} fillProps={fillProps} customMessages={customMessages}  {...otherProps}>
          <div className={classes.buttonContainer}>
            {fillProps.actions}
            {otherProps.draftButton}
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              {customMessages?.submit ?? <FormattedMessage defaultMessage="Lähetä" />}
            </Button>
          </div>
        </Form>
      )
    } else {
      return <Form ref={ref} fillProps={fillProps} customMessages={customMessages} {...otherProps} />
    }
  })
}
