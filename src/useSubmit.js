import { useMutations } from './api';

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
    async onSubmit(...args) {
      let allowSubmitting = true;

      // Maybe prevent submit, optionally get args.
      if (onPreSubmit) {
        allowSubmitting = await onPreSubmit(...args);
        if (Array.isArray(allowSubmitting)) {
          args = allowSubmitting;
        }
      }

      if (allowSubmitting) {
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
      }
    },
    ...other,
  };
};
