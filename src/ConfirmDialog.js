import {
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
  useTheme,
} from '@material-ui/core';
import produce from 'immer';
import {
  forwardRef,
  Fragment,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { FormattedMessage, useIntl } from 'react-intl';
import { useConfig } from './api';
import { hasCaptcha, hasConsent, hasPreview } from './customize';
import { PrintButton } from './PrintButton';
import Field from './Review/Field';

export default forwardRef(function ConfirmDialog(
  {
    title,
    description,
    children,
    onConfirm,
    confirmComponent: Customizer = Fragment,
    ...otherProps
  },
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
    error() {
      handleError();
    },
  }));

  // const dialogContentFlexNoneClasses = useStylesDialogContentFlexNone();

  const confirmRef = useRef();
  const hasCaptchaValue = hasCaptcha(otherProps);
  const hasConsentValue = hasConsent(otherProps);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showReCAPTCHA, setShowReCAPTCHA] = useState(hasCaptchaValue);
  const [captchaChallenge, setCaptchaChallenge] = useState();
  const [consent, setConsent] = useState(false);

  function handleClose() {
    setLoading(false);
    setError(false);
    setOpen(false);
    setShowReCAPTCHA(hasCaptchaValue);
  }

  function handleDismiss() {
    if (!loading || error) {
      setLoading(false);
      setError(false);
      handleClose();
      confirmRef.current(false);
    }
  }

  function handleLoading() {
    setLoading(true);
  }

  function handleError() {
    setError(true);
    setLoading(false);
  }

  function handleConfirm() {
    confirmRef.current(hasCaptchaValue ? captchaChallenge : true);
  }

  const intl = useIntl();

  return (
    <Customizer {...otherProps}>
      <Dialog
        scroll="body"
        open={open}
        onClose={handleDismiss}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
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
                <FormattedMessage defaultMessage="Lähettävien tietojen esikatselu" />
              </Typography>
              <Field root {...otherProps} />
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
              <FormattedMessage defaultMessage="Lomakkeen lähetys ei onnistunut." />
            </DialogContentText>
          )}
        </DialogContent>
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
      </Dialog>
    </Customizer>
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
