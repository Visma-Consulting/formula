import produce from 'immer';
import { flow } from 'lodash';
import * as autocomplete from './autocomplete';
import * as showCharacterCounter from './showCharacterCounter';

// Order of plugins
const typePlugins = [autocomplete, showCharacterCounter];

export default ({ extraTypePlugins = [], config }) =>
  // Run plugins in the given order
  flow(
    [...typePlugins, ...extraTypePlugins]
      // Plugin type must match with the config type
      .filter(({ types }) => types.includes(config.type))
      .map(({ converter }) => config |> converter |> produce)
  );
