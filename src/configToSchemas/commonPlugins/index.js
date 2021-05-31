import produce from 'immer';
import { flow } from 'lodash';
import fieldTitleSupport from './fieldTitleSupport';
import repeatableFieldSupport from './repeatableFieldSupport';
import descriptionAndHelp from './descriptionAndHelp';

const converters = [
  fieldTitleSupport,
  descriptionAndHelp,
  repeatableFieldSupport,
];

export default (config) =>
  flow(converters.map((converter) => config |> converter |> produce));
