const toArray = ({ title, ...item }) => ({
  title,
  type: 'array',
  items: item,
});

export const schema = (config) => (item) => config.list ? toArray(item) : item;

export const uiSchema = (config) => (item) =>
  config.list ? { items: item } : item;
