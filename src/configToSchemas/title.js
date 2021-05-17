import deprecate from 'util-deprecate';

const nameAsTitle = deprecate(
  ({ name, type }, item) => ({ title: name, ...item }),
  'field.name is deprecated. Use field.title instead.'
);

export const schema = (config) => (item) => {
  const { name, title } = config;

  if (name) {
    return nameAsTitle(config, item);
  }

  return { title, ...item };
};
