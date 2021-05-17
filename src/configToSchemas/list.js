export const schema = (config) => (item) => {
  const { list } = config;
  const { title } = item;

  return {
    title,
    ...(list
      ? {
          type: 'array',
          items: {
            ...item,
            title: undefined, // Remove title from each individual element
          },
        }
      : item),
  };
};

export const uiSchema = (config) => (item) =>
  config.list ? { items: item } : item;
