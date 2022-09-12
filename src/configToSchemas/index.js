import { mapValues } from 'lodash';
import commonPlugins from './commonPlugins';
import typePlugins from './typePlugins';
import * as builtInTypes from './types';

export default (props) => {
  const types = {
    ...mapValues(builtInTypes, (type) => type.default),
    ...props.extraTypes,
  };

  const typeConverter =
    typeof props.config.type === 'function'
      ? props.config.type
      : types[props.config.type];

  if (!typeConverter) {
    return { schema: {} };
  }

  return {
    ...props,
    ...(typeConverter(props)
      |> typePlugins(props)
      |> commonPlugins(props.config)),
  };
};
