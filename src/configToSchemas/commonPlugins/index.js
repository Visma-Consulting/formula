import produce from 'immer';
import { flow } from 'lodash';
import fieldTitleSupport from './fieldTitleSupport';
import repeatableFieldSupport from './repeatableFieldSupport';

const converters = [fieldTitleSupport, repeatableFieldSupport];

export default (config) =>
  flow(converters.map((converter) => config |> converter |> produce));
