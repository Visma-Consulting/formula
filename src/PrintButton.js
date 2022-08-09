import Button from '@mui/material/Button';
import { Print } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';

export function PrintButton() {
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
