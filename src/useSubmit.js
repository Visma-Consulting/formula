import { useMutations } from './api';
import { chain } from './utils';

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

  onSubmit ??= submit;

  return {
    onSubmit: chain([
      onPreSubmit,
      async (...args) => {
        const [{ captchaChallenge, formData }] = args;
        const data = {
          status: 'SUBMITTED',
          form: {
            id: config._id,
            rev: config._rev,
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
