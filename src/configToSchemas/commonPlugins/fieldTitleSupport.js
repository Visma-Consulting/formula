import deprecate from 'util-deprecate';

const nameAsTitle = deprecate(({ name }, props) => {
  props.schema.title = name;
}, 'config.name is deprecated. Use config.title instead.');

export default (config) => (props) => {
  const { name, title } = config;

  if (name) {
    return nameAsTitle(config, props);
  }

  props.schema.title = title;
};
