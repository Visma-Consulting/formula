import * as types from './types';
import typePlugins from './typePlugins';
import commonPlugins from './commonPlugins';

export default (config) => {
  const typeConverter = types[config.type];
  if (!typeConverter) {
    // eslint-disable-next-line no-console
    console.error(`Config type "${config.type}" is not implemented.`);
    return { schema: {} };
  }
  return typeConverter(config) |> typePlugins(config) |> commonPlugins(config);
};
