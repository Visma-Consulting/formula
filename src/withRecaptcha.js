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
  return forwardRef(({fillProps, ...otherProps}, ref) => {
    const intl = useIntl();
    const classes = useStyles();
    const theme = useTheme().palette.type;
    const [captchaChallenge, setCaptchaChallenge] = useState();
    const [recaptchaComponent, setRecaptchaComponent] = useState();
    const { recaptcha } = useConfig();

    const onCloseDialog = () => {
      setCaptchaChallenge(undefined);
      recaptchaComponent?.reset();
    }

    if (otherProps?.config?.publicForm && (otherProps?.isLastStep === true || otherProps?.isLastStep === undefined)) {
      return (
        <Form ref={ref} fillProps={fillProps} {...otherProps} captcha={captchaChallenge} onCloseDialog={onCloseDialog} >
          <ReCAPTCHA
            ref={e => setRecaptchaComponent(e)}
            sitekey={recaptcha.sitekey}
            theme={theme}
            hl={intl.locale?.split('-')[0]}
            onChange={setCaptchaChallenge} className={classes.recaptcha} />
          <div className={classes.buttonContainer}>
            {fillProps?.actions ?? null}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!captchaChallenge}
            >
              <FormattedMessage defaultMessage="Lähetä" />
            </Button>
          </div>
        </Form>
      )
    } else {
      return <Form ref={ref} {...otherProps} />
    }
  })
}
