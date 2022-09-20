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
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import produce from 'immer';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { FormattedMessage, useIntl, defineMessage } from 'react-intl';
import { useConfig } from './api';
import { hasCaptcha, hasConsent, hasPreview } from './customizations';
import { PrintButton } from './PrintButton';
import Field from './Review/Field';
import { Customize } from './utils';

const sendErrorMessages = {
  10: defineMessage({defaultMessage: 'Lomakkeen lähetys ei onnistunut.'}),
  40: defineMessage({defaultMessage: 'Lomakkeen lähetys ei onnistunut, koska liitetiedostojen virustarkistus epäonnistui.'}),
  50: defineMessage({defaultMessage: 'Lomakkeen lähetys ei onnistunut, koska captchatarkistus epäonnistui.'})
};

export default forwardRef(function ConfirmDialog(
  { container, title, description, children, onConfirm, confirmComponent, ...otherProps },
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

  const confirmRef = useRef();
  const hasCaptchaValue = hasCaptcha(otherProps);
  const hasConsentValue = hasConsent(otherProps);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showReCAPTCHA, setShowReCAPTCHA] = useState(hasCaptchaValue);
  const [captchaChallenge, setCaptchaChallenge] = useState();
  const [consent, setConsent] = useState(false);
  const intl = useIntl();

  function handleClose() {
    setLoading(false);
    setError(false);
    setOpen(false);
    setShowReCAPTCHA(hasCaptchaValue);
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

  function handleConfirm() {
    confirmRef.current(hasCaptchaValue ? captchaChallenge : true);
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
                <FormattedMessage defaultMessage="Lähetettävien tietojen esikatselu" />
              </Typography>
              <Field
                preview // For selecting optional preview / review customization
                root
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
              label={intl.formatMessage({
                defaultMessage: 'Vahvistan ilmoitetut tiedot oikeiksi',
              })}
            />
          )}
          {showReCAPTCHA && !loading && !error ? (
            <DialogContentReCAPTCHA onChange={setCaptchaChallenge} />
          ) : null}
          {loading && (
            <div>
              <CircularProgress />
            </div>
          )}
          {error && (
            <DialogContentText>
              <Alert severity="warning">{error}</Alert>
            </DialogContentText>
          )}
        </DialogContent>
        <Box displayPrint="none">
          <DialogActions>
            <Button disabled={loading && !error} onClick={handleDismiss}>
              <FormattedMessage defaultMessage="Peruuta" />
            </Button>
            {hasPreview(otherProps) && <PrintButton />}
            <Button
              disabled={
                (hasConsentValue && !consent) ||
                (showReCAPTCHA && !captchaChallenge) ||
                loading ||
                error
              }
              onClick={handleConfirm}
              variant="contained"
              color="primary"
              autoFocus
            >
              <FormattedMessage defaultMessage="Lähetä" />
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Customize>
  );
});

function DialogContentReCAPTCHA(props) {
  const theme = useTheme().palette.type;
  const { recaptcha } = useConfig();

  return (
    <DialogContent>
      <ReCAPTCHA sitekey={recaptcha.sitekey} theme={theme} {...props} />
    </DialogContent>
  );
}
