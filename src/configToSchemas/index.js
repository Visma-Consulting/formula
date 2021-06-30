import * as builtInTypes from './types';
import typePlugins from './typePlugins';
import commonPlugins from './commonPlugins';
import { mapValues } from 'lodash';

export default (props) => {
  const types = {
    ...mapValues(builtInTypes, (type) => type.default),
    ...props.extraTypes,
  };
  const typeConverter = types[props.config.type];
  if (!typeConverter) {
    // eslint-disable-next-line no-console
    console.error(`Config type "${props.config.type}" is not implemented.`);
    return { schema: {} };
  }
  const { config, ...otherProps } = props;

  return {
    ...otherProps,
    ...(typeConverter(props) |> typePlugins(props) |> commonPlugins(config)),
  };
};
