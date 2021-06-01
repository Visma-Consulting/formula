import produce from 'immer';
import { flow } from 'lodash';
import fieldTitleSupport from './fieldTitleSupport';
import repeatableFieldSupport from './repeatableFieldSupport';
import base from './base';
const converters = [base, fieldTitleSupport, repeatableFieldSupport];

export default (config) =>
  flow(converters.map((converter) => config |> converter |> produce));
