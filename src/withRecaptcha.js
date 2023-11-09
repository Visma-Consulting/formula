import { forwardRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormattedMessage, useIntl } from 'react-intl';
import Button from '@material-ui/core/Button';
import ReCAPTCHA from 'react-google-recaptcha';
import { useTheme } from '@material-ui/core';
import { useConfig } from './client';

const useStyles = makeStyles((theme) => ({
  recaptcha: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  buttonContainer: {
    '& > *': {
      marginRight: theme.spacing(1),
      '@media print': {
        display: 'none',
      },
    },
  }
}));

export default function withRecaptcha(Form) {
  return forwardRef(({fillProps, onError, ...otherProps}, ref) => {
    const intl = useIntl();
    const classes = useStyles();
    const theme = useTheme().palette.type;
    const [captchaChallenge, setCaptchaChallenge] = useState();
    const [recaptchaComponent, setRecaptchaComponent] = useState();
    const [hideCaptcha, setHideCaptcha] = useState(false);
    const { recaptcha } = useConfig();

    const onCloseDialog = () => {
      setCaptchaChallenge(undefined);
      setHideCaptcha(false);
      recaptchaComponent?.reset();
    }

    if (!otherProps?.noReCaptcha && otherProps?.config?.requireCaptcha && (otherProps?.isLastStep === true || otherProps?.isLastStep === undefined)) {
      return (
        <Form
          ref={ref}
          fillProps={fillProps}
          {...otherProps}
          onError={(props) => {
            setHideCaptcha(false);
            onError(props);
          }}
          captcha={captchaChallenge}
          onCloseDialog={onCloseDialog} >
          <div style={hideCaptcha ? {display: 'none'} : {}}>
            <ReCAPTCHA
              ref={e => setRecaptchaComponent(e)}
              sitekey={recaptcha.sitekey}
              theme={theme}
              hl={intl.locale?.split('-')[0]}
              onChange={setCaptchaChallenge}
              className={classes.recaptcha} />
          </div>
          <div className={classes.buttonContainer}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!captchaChallenge}
              onClick={() => setHideCaptcha(true)}
            >
              <FormattedMessage defaultMessage="Lähetä" />
            </Button>
            {fillProps?.actions ?? null}
          </div>
        </Form>
      )
    } else {
      return <Form ref={ref} onError={onError} {...otherProps} />
    }
  })
}
