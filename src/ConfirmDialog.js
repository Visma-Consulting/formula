import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
  CircularProgress
} from '@material-ui/core';
import produce from 'immer';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { FormattedMessage } from 'react-intl';
import { useConfig } from './api';

const preventDefault = (event) => {
  event.preventDefault();
};

export const isCaptchaRequired = (config) =>
  config.publicForm &&
  // Form may not have `requireCaptcha` defined.
  (config.requireCaptcha || config.requireCaptcha === undefined);

export default forwardRef(function ConfirmDialog(
  { title, description, children, onConfirm, ...other },
  ref
) {
  useImperativeHandle(ref, () => ({
    confirm(...args) {
      return new Promise((resolve) => {
        confirmRef.current = function (confirm) {
          resolve(
            isCaptchaRequired(other.config)
              ? confirm &&
                  produce(args, ([data]) => {
                    data.captchaChallenge = confirm;
                  })
              : confirm
          );
        };
        setOpen(true);
      });
    },
    loading() {
      handleLoading();
    },
    close() {
      handleClose();
    }
  }));

  const confirmRef = useRef();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showReCAPTCHA, setShowReCAPTCHA] = useState(
    isCaptchaRequired(other.config)
  );
  const [captchaChallenge, setCaptchaChallenge] = useState();

  function handleClose() {
    setLoading(false);
    setOpen(false);
    if (showReCAPTCHA && captchaChallenge) {
      setShowReCAPTCHA(false);
    }
  }

  function handleDismiss() {
    handleClose();
    confirmRef.current(false);
  }

  function handleLoading() {
    setLoading(true);
  }

  function handleConfirm() {
    //handleClose();
    confirmRef.current(
      isCaptchaRequired(other.config) ? captchaChallenge : true
    );
  }

  return (
    <Dialog
      open={open}
      onClose={handleDismiss}
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
      {showReCAPTCHA && (
        <DialogContentReCAPTCHA onChange={setCaptchaChallenge} />
      )}
      {loading && (
        <DialogContent>
          <CircularProgress />
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={handleDismiss}>
          <FormattedMessage defaultMessage="Peruuta" />
        </Button>
        <Button
          disabled={(showReCAPTCHA && !captchaChallenge) || loading}
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

function DialogContentReCAPTCHA(props) {
  const theme = useTheme().palette.type;
  const { recaptcha } = useConfig();

  return (
    <DialogContent>
      <ReCAPTCHA
        sitekey={recaptcha.sitekey}
        render="explicit"
        autofocus
        tabindex={-1}
        theme={theme}
        {...props} />
    </DialogContent>
  );
}
