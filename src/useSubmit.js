import { useApi } from './api';

export default ({ onSubmit, onPostSubmit, ...other }) => {
  const api = useApi();
  const { config } = other;

  onSubmit ??= api.handleSubmit;

  const handleSubmit = (data, ...rest) =>
    onSubmit({ ...data, config }, ...rest);

  return {
    onSubmit: onPostSubmit
      ? async (...args) => onPostSubmit(await handleSubmit(...args), ...args)
      : handleSubmit,
    ...other,
  };
};
