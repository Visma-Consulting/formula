import produce from 'immer';
import { flow } from 'lodash';
import * as showCharacterCounter from './showCharacterCounter';

// Order of plugins
const converters = [showCharacterCounter];

export default (config) =>
  // Run plugins in given order
  flow(
    converters
      // Plugin type must match with config type
      .filter(({ types }) => types.includes(config.type))
      .map(({ default: converter }) => converter)
      .map((converter) => config |> converter |> produce)
  );
