import { useMutations } from './api';
import { chain } from './utils';
import { useIntl } from 'react-intl';
import { forceBlur } from "./withOnTouch.js";

export default ({
  onSubmit,
  onPostSubmit,
  onPreSubmit,
  confirm,
  formMetaData,
  ...other
}) => {
  const { submit } = useMutations();
  const { config } = other;
  const intl = useIntl();
  const { locale } = intl
  onSubmit ??= submit;

  return {
    onSubmit: chain([
      onPreSubmit,
      async (...args) => {
        forceBlur();
        const [{ captchaChallenge, formData }] = args;
        const data = {
          status: 'SUBMITTED',
          form: {
            id: config._id,
            rev: config._rev,
            lang: locale.split('-')[0],
          },
          ...formMetaData,
          values: formData,
          captchaChallenge,
        };
        const response = await onSubmit(data, ...args);

        onPostSubmit?.(response, data, ...args);
      },
    ]),
    ...other,
  };
};
