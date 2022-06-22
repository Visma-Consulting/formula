import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import { useIntl } from 'react-intl';
import Markdown from '../Markdown';
import { PrintButton } from '../PrintButton';
import { Customize } from '../utils';
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
    <Customize
      customizer={props[props.preview ? 'previewForm' : 'reviewForm']}
      {...props}
    >
      <Alert severity="success">
        {intl.formatMessage({ defaultMessage: 'Lomake lähetetty!' })}
      </Alert>
      <Field root {...props} />
      <Markdown>{props.config.successText}</Markdown>
      <div className={classes.buttonContainer}>
        {props.reviewProps?.actions}
        <PrintButton />
      </div>
    </Customize>
  );
}

export const empty = '–';
