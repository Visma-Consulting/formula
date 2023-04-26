import { forwardRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormattedMessage, useIntl } from 'react-intl';
import Button from '@material-ui/core/Button';
import ReCAPTCHA from 'react-google-recaptcha';
import { useTheme } from '@material-ui/core';
import { useConfig } from './client';

export default function withRecaptcha(Form) {
  const useStyles = makeStyles((theme) => ({
    recaptcha: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    }
  }));
  return forwardRef(({...otherProps}, ref) => {
    const intl = useIntl();
    const classes = useStyles();
    const theme = useTheme().palette.type;
    const [captchaChallenge, setCaptchaChallenge] = useState();
    const { recaptcha } = useConfig();
    if (otherProps?.config?.publicForm && (otherProps?.isLastStep === true || otherProps?.isLastStep === undefined)) {
      return (
        <Form ref={ref} {...otherProps} captcha={captchaChallenge} >
          <ReCAPTCHA sitekey={recaptcha.sitekey} theme={theme} hl={intl.locale?.split('-')[0]} onChange={setCaptchaChallenge} className={classes.recaptcha} />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!captchaChallenge}
            >
              <FormattedMessage defaultMessage="Lähetä" />
            </Button>
        </Form>
      )
    } else {
      return <Form ref={ref} {...otherProps} />
    }
  })
}
