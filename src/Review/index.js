import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Print } from '@material-ui/icons';
import { FormattedMessage, useIntl } from 'react-intl';
import Markdown from '../Markdown';
import Field from './Field';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

export default function Review(props) {
  const classes = useStyles();
  const intl = useIntl();

  return (
    <>
      <Alert severity="success">
        { intl.formatMessage({defaultMessage: 'Lomake lähetetty!'}) }
      </Alert>
      <Field root {...props} />
      <Markdown>{props.config.successText}</Markdown>
      <div className={classes.buttonContainer}>
        {props.reviewProps?.actions}
        <Button
          variant="contained"
          startIcon={<Print />}
          onClick={global.print}
          aria-label={intl.formatMessage({
            defaultMessage: 'Tulosta. Avautuu PDF:nä uuteen ikkunaan.'
          })}
        >
          <FormattedMessage defaultMessage="Tulosta" />
        </Button>
      </div>
    </>
  );
}

export const empty = '–';
