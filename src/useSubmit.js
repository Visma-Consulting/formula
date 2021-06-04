import { useMutations } from './api';

export default ({ onSubmit, onPostSubmit, ...other }) => {
  const { submit } = useMutations();
  const { config } = other;

  onSubmit ??= submit;

  const handleSubmit = (data, ...rest) =>
    onSubmit({ ...data, config }, ...rest);

  return {
    onSubmit: onPostSubmit
      ? async (...args) => onPostSubmit(await handleSubmit(...args), ...args)
      : handleSubmit,
    ...other,
  };
};
