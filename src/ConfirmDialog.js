import { FormattedMessage } from 'react-intl';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

const preventDefault = (event) => {
  event.preventDefault();
};

export default forwardRef(function ConfirmDialog(
  { title, description, children, onConfirm, ...other },
  ref
) {
  useImperativeHandle(ref, () => ({
    confirm() {
      return new Promise((resolve) => {
        confirmRef.current = resolve;
        setOpen(true);
      });
    },
  }));

  const confirmRef = useRef();

  const [open, setOpen] = useState(false);

  const handleClose = (event) => {
    setOpen(false);
    confirmRef.current(false);
  };

  function handleConfirm(event) {
    setOpen(false);
    confirmRef.current(true);
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      onClick={preventDefault}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
      {description && (
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            {description}
          </DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={handleClose}>
          <FormattedMessage defaultMessage="Peruuta" />
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="primary"
          autoFocus
        >
          <FormattedMessage defaultMessage="Lähetä" />
        </Button>
      </DialogActions>
    </Dialog>
  );
});
