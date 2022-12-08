import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import { useIntl } from 'react-intl';
import Markdown from '../Markdown';
import { PrintButton } from '../PrintButton';
import Field from './Field';

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    '& > *': {
      margin: theme.spacing(1),
      '@media print': {
        display: 'none',
      },
    },
  },
}));

export default function Review(props) {
  const classes = useStyles();
  const intl = useIntl();
  const { config } = props;
  const showSuccessText = props.reviewProps?.showSuccessText !== false;
  return (
    <>
      {props.reviewProps?.showSuccessText !== false &&
      <Alert severity="success">
        {props.customMessages?.submitConfirmation ?? intl.formatMessage({ defaultMessage: 'Lomake lähetetty!' })}
      </Alert>
      }
      {
        showSuccessText && config?.showSuccessTextOnTop ?
          <Markdown>{props.config.successText}</Markdown> : <></>
      }
      <Field root {...props} />
      {
        showSuccessText && !config?.showSuccessTextOnTop ?
          <Markdown>{props.config.successText}</Markdown> : <></>
      }
      <div className={classes.buttonContainer}>
        {props.reviewProps?.actions}
        <PrintButton />
      </div>
    </>
  );
}

export const empty = '–';
