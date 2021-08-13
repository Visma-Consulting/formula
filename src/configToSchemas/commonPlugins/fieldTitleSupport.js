export default (config) => (props) => {
  props.schema.title = config.useLabel ? config.label : config.title;
};
