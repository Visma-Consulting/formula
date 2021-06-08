import { useMutations } from './api';

export default ({ onSubmit, onPostSubmit, onPreSubmit, confirm, ...other }) => {
  const { submit } = useMutations();
  const { config } = other;

  onSubmit ??= submit;

  const handleSubmit = async (...args) => {
    if (!onPreSubmit || (await onPreSubmit(...args))) {
      const [data, ...rest] = args;
      return onSubmit({ ...data, config }, ...rest);
    }
  };

  return {
    onSubmit: onPostSubmit
      ? async (...args) => onPostSubmit(await handleSubmit(...args), ...args)
      : handleSubmit,
    ...other,
  };
};
