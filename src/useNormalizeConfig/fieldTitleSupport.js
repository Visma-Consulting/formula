import deprecate from 'util-deprecate';

const nameAsTitle = deprecate(
  ({ name, ...config }, props) => ({
    title: name,
    ...config,
  }),
  'config.name is deprecated. Use config.title instead.'
);

export default (config) => {
  const { name } = config;

  if (name) {
    return nameAsTitle(config);
  }

  return config;
};
