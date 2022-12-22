import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import { useIntl } from 'react-intl';
import Markdown from '../Markdown';
import { PrintButton } from '../PrintButton';
import Field from './Field';
import { useEffect, useRef } from 'react';

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    '& > *': {
      margin: theme.spacing(1),
      '@media print': {
        display: 'none',
      },
    },
  },
  successTextBox: {
    marginBottom: '5px',
    marginTop: '5px',
    color: theme.palette.primary,
    borderStyle: 'solid',
    borderRadius: '3px',
    borderSpacing: '15px'
  },
  successText: {
  padding: '5px',
  paddingLeft: '20px',
  color: theme.palette.primary,
  fontWeight: 'bold',
  fontSize: '1.1em'
},

}));

export default function Review(props) {
  const classes = useStyles();
  const intl = useIntl();
  const { config } = props;
  const showSuccessText = props.reviewProps?.showSuccessText !== false;
  const highlightSuccessText = props.reviewProps?.highlightSuccessText;
  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  function checkSuccessHighlight() {
    return highlightSuccessText === true ?
        <div className={classes.successTextBox}>
        <Markdown className={classes.successText}>{props.config.successText}</Markdown> </div> :
        <Markdown>{props.config.successText}</Markdown>
  }
  return (
    <>
      {props.reviewProps?.showSuccessText !== false &&
      <Alert severity="success">
        {props.customMessages?.reviewSubmitConfirmation ?? intl.formatMessage({ defaultMessage: 'Lomake lähetetty!' })}
      </Alert>
      }
      {
        showSuccessText && config?.showSuccessTextOnTop ?
          checkSuccessHighlight(): <></>
      }
      <Field root {...props} />
      {
        showSuccessText && !config?.showSuccessTextOnTop ?
          checkSuccessHighlight() : <></>
      }
      <div className={classes.buttonContainer}>
        {props.reviewProps?.actions}
        <PrintButton />
      </div>
    </>
  );
}

export const empty = '–';
