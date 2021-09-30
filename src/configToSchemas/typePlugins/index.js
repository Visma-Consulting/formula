import produce from 'immer';
import { flow } from 'lodash';
import * as autocomplete from './autocomplete';
import * as formGroupList from './formGroupList';
import * as showCharacterCounter from './showCharacterCounter';

// Order of plugins
const typePlugins = [autocomplete, showCharacterCounter, formGroupList];

export default (props) => {
  const { extraTypePlugins = [], config } = props;
  // Run plugins in the given order
  return flow(
    [...typePlugins, ...extraTypePlugins]
      // Plugin type must match with the config type
      .filter(({ types }) => types.includes(config.type))
      .map(({ converter }) => props |> converter |> produce)
  );
};
