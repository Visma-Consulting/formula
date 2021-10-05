import produce from 'immer';
import { flow } from 'lodash';
import base from './base';
import fieldTitleSupport from './fieldTitleSupport';
import repeatableFieldSupport from './repeatableFieldSupport';

const converters = [base, fieldTitleSupport, repeatableFieldSupport];

export default (config) =>
  flow(converters.map((converter) => config |> converter |> produce));
