import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Typography,
  useMediaQuery
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import produce from 'immer';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { FormattedMessage, useIntl, defineMessage } from 'react-intl';
import { hasCaptcha, hasConsent, hasPreview, hasPrint } from './customizations';
import { PrintButton } from './PrintButton';
import Field from './Review/Field';
import { Customize } from './utils';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const sendErrorMessages = {
  10: defineMessage({defaultMessage: 'Lomakkeen lähetys ei onnistunut.'}),
  40: defineMessage({defaultMessage: 'Lomakkeen lähetys ei onnistunut, koska liitetiedostojen virustarkistus epäonnistui.'}),
  50: defineMessage({defaultMessage: 'Lomakkeen lähetys ei onnistunut, koska captchatarkistus epäonnistui.'})
};

export default forwardRef(function ConfirmDialog(
  { container, title, description, children, onConfirm, confirmComponent, customMessages, onCloseDialog, ...otherProps },
  ref
) {
  useImperativeHandle(ref, () => ({
    confirm(...args) {
      return new Promise((resolve) => {
        confirmRef.current = function (confirm) {
          resolve(
            hasCaptcha(otherProps)
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
    },
    error(data) {
      handleError(data);
    },
  }));

  // const dialogContentFlexNoneClasses = useStylesDialogContentFlexNone();
  const pageTitlesArray = otherProps?.config?.elements.filter(x => (x.type === 'pageTitle' && x.content));
  const confirmRef = useRef();
  const hasCaptchaValue = hasCaptcha(otherProps);
  const hasConsentValue = hasConsent(otherProps);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [consent, setConsent] = useState(false);
  const intl = useIntl();
  const { executeRecaptcha } = useGoogleReCaptcha();

  function handleClose() {
    setLoading(false);
    setError(false);
    setOpen(false);
    onCloseDialog?.();
  }

  function handleDismiss() {
    if (!loading || error) {
      setLoading(false);
      setError(null);
      handleClose();
      confirmRef.current(false);
    }
  }

  function handleLoading() {
    setLoading(true);
  }

  function handleError(data) {
    setError(sendErrorMessages[data.errorCode]
      ? intl.formatMessage(sendErrorMessages[data.errorCode])
      : data.message);
    setLoading(false);
  }

  async function handleConfirm() {
    if (hasCaptchaValue) {
      const token = await executeRecaptcha('submit');
      confirmRef.current(token);
    } else {
      confirmRef.current(true);
    }
  }

  return (
    <Customize customizer={confirmComponent} {...otherProps}>
      <Dialog
        scroll="body"
        open={open}
        onClose={handleDismiss}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        fullScreen={useMediaQuery('print')}
        container={container}
        disableBackdropClick
      >
        <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
        <DialogContent>
          {description && (
            <DialogContentText id="confirm-dialog-description">
              {description}
            </DialogContentText>
          )}
          {hasPreview(otherProps) && (
            <>
              <Typography variant="subtitle1" component="h3">
                {customMessages?.confirmDialogPreview ?? <FormattedMessage defaultMessage="Lähetettävien tietojen esikatselu" />}
              </Typography>
              <Field
                preview // For selecting optional preview / review customization
                root
                pageTitles={pageTitlesArray}
                {...otherProps}
              />
            </>
          )}
          {hasConsentValue && (
            <FormControlLabel
              key="consent"
              control={
                <Checkbox
                  checked={consent}
                  onChange={(event) => {
                    setConsent(event.target.checked);
                  }}
                  name="consent"
                  color="secondary"
                />
              }
              label={customMessages?.confirmDialogConsent ?? intl.formatMessage({
                defaultMessage: 'Vahvistan ilmoitetut tiedot oikeiksi',
              })}
            />
          )}
          {loading && (
            <div><CircularProgress/></div>
          )}
          {error && (
            <DialogContentText>
              <Alert severity="error">{error}</Alert>
            </DialogContentText>
          )}
        </DialogContent>
        <Box displayPrint="none">
          <DialogActions>
            <Button disabled={loading && !error} onClick={handleDismiss}>
              {customMessages?.confirmDialogCancelButton ?? <FormattedMessage defaultMessage="Peruuta" />}
            </Button>
            {hasPreview(otherProps) && hasPrint(otherProps) && <PrintButton />}
            <Button
              disabled={
                (hasConsentValue && !consent) ||
                loading ||
                error ||
                (!loading && hasCaptchaValue && !executeRecaptcha)
              }
              onClick={handleConfirm}
              variant="contained"
              color="primary"
              autoFocus
            >
              {customMessages?.confirmDialogSendButton ?? <FormattedMessage defaultMessage="Lähetä" />}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Customize>
  );
});
