import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Print } from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';
import Markdown from '../Markdown';
import Field from './Field';

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

export default function Review(props) {
  const classes = useStyles();

  return (
    <>
      <Field root {...props} />
      <Markdown>{props.config.successText}</Markdown>
      <div className={classes.buttonContainer}>
        {props.reviewProps?.actions}
        <Button
          variant="contained"
          startIcon={<Print />}
          onClick={global.print}
        >
          <FormattedMessage defaultMessage="Tulosta" />
        </Button>
      </div>
    </>
  );
}

export const empty = '–';
