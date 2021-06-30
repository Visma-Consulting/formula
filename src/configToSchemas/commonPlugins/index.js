import produce from 'immer';
import { flow } from 'lodash';
import fieldTitleSupport from './fieldTitleSupport';
import repeatableFieldSupport from './repeatableFieldSupport';
import anyOf from './oneOf';
import base from './base';
const converters = [base, fieldTitleSupport, anyOf, repeatableFieldSupport];

export default (config) =>
  flow(converters.map((converter) => config |> converter |> produce));
