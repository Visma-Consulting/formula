import {forwardRef} from "react";
import {GoogleReCaptchaProvider} from "react-google-recaptcha-v3";
import {useConfig} from "./client.js";
import {useIntl} from "react-intl";

export default function withRecaptchaProvider(Form) {
  return forwardRef((props, ref) => {
    const {externalReCaptchaProviderExists, config, isLastStep} = props;
    const { recaptcha } = useConfig();
    const intl = useIntl();
    if (!externalReCaptchaProviderExists && config?.requireCaptcha && (isLastStep === true || isLastStep === undefined)) {
      return (
        <GoogleReCaptchaProvider reCaptchaKey={recaptcha.sitekey} language={intl.locale?.split('-')[0]}>
          <Form ref={ref} {...props} />
        </GoogleReCaptchaProvider>
      );
    } else {
      return <Form ref={ref} {...props} />
    }
  })
}
