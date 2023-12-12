import { Alert, AlertTitle } from '@material-ui/lab';
import { FormattedMessage } from 'react-intl';

export default function ErrorFallback({error, customMessage}) {
  console.error(error.stack ?? error);
  return (<Alert severity="error">
    <AlertTitle>{customMessage ?? <FormattedMessage defaultMessage="Tapahtui odottamaton virhe." />}</AlertTitle>
  </Alert>);
}
