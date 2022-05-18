import Button from '@material-ui/core/Button';
import { Print } from '@material-ui/icons';
import { FormattedMessage, useIntl } from 'react-intl';

export function PrintButton() {
  const intl = useIntl();

  return (
    <Button
      variant="contained"
      startIcon={<Print />}
      onClick={() => setTimeout(() => global.print(), 0)}
    >
      <FormattedMessage defaultMessage="Tulosta" />
    </Button>
  );
}
