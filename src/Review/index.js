import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import { useIntl } from 'react-intl';
import Markdown from '../Markdown';
import { PrintButton } from '../PrintButton';
import Field from './Field';
import {useEffect, useRef, useState} from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    '& > *': {
      marginRight: theme.spacing(1),
      marginTop: theme.spacing(1),
      '@media print': {
        display: 'none',
      },
    },
  },
  successTextBox: {
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(3),
    color: theme.palette.primary,
    borderStyle: 'solid',
    borderRadius: '3px',
    borderSpacing: '15px'
  },
  successText: {
  padding: '5px',
  paddingLeft: '20px',
  paddingRight: '20px',
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
  const summaries = config?.elements?.filter(element => element.type === 'summary');
  const [hideNotAnswered, setHideNotAnswered] = useState(props.reviewProps?.hideNotAnswered ?? false);
  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);
  const pageTitlesArray = props?.config?.elements.filter(x => (x.type === 'pageTitle' && x.content));
  function checkSuccessHighlight() {
    return highlightSuccessText === true ?
      <div className={classes.successTextBox}>
        <Markdown className={classes.successText}>{props.config.successText}</Markdown>
        {summaries && <>
          {summaries?.map(summary => (
            <Markdown className={classes.successText}>
              {summary.content}
            </Markdown>
          ))}
        </>} </div>
      :
      <div>
        <Markdown>{props.config.successText}</Markdown>
        {summaries && <>
        {summaries?.map(summary => (
          <Markdown>
            {summary.content}
          </Markdown>
        ))}
      </>} </div>
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
      {
        props.reviewProps?.hideNotAnswered
          ? <FormControlLabel
            checked={hideNotAnswered}
            onChange={props => setHideNotAnswered(props.target.checked)}
            control={<Checkbox/>}
            label="Piilota vastaamattomat kysymykset" />
          : <></>
      }
      <Field root {...props} pageTitles={pageTitlesArray} hideNotAnswered={hideNotAnswered} />
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
