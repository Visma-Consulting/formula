export default (config) => {
  if (config.type === 'number') {
    config.multipleOf ??= 1;
  }

  return config;
};
