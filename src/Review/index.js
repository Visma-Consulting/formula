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
  return (
    <>
      {props.reviewProps?.showSuccessText !== false &&
      <Alert severity="success">
        {intl.formatMessage({ defaultMessage: 'Lomake lähetetty!' })}
      </Alert>
      }
      <Field root {...props} />
      {props.reviewProps?.showSuccessText !== false &&
      <Markdown>{props.config.successText}</Markdown>
      }
      <div className={classes.buttonContainer}>
        {props.reviewProps?.actions}
        <PrintButton />
      </div>
    </>
  );
}

export const empty = '–';
