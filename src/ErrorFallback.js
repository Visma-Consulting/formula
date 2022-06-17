import { Alert, AlertTitle } from '@material-ui/lab';
import { FormattedMessage } from 'react-intl';

export default function ErrorFallback({error}) {
  console.error(error.stack ?? error);
  return (<Alert severity="error">
    <AlertTitle><FormattedMessage defaultMessage="Hupsista! Tapahtui odottamaton virhe." /></AlertTitle>
    <FormattedMessage defaultMessage="Yritä myöhemmin uudelleen." />
  </Alert>);
}
