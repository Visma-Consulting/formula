export default (config) => (props) => {
  if (config.list) {
    const { title, ...items } = props.schema;
    props.schema = {
      title,
      type: 'array',
      items,
    };
    props.uiSchema = { items: props.uiSchema };
  }
};
