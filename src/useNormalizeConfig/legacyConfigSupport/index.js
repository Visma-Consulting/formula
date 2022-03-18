import { map, update } from 'lodash/fp';
import booleanDefault from './booleanDefault';
import booleanWidget from './booleanWidget';
import filter from './filter';
import formgroupType from './formgroupType';
import multiselectWidget from './multiselectWidget';
import nameAsTitle from './nameAsTitle';
import selectWidget from './selectWidget';
import textDefault from './textDefault';
import numberMultipleOf from './numberMultipleOf';

export default function legacyConfigSupport(config) {
  return (
    config
    |> booleanDefault
    |> booleanWidget
    |> formgroupType
    |> multiselectWidget
    |> nameAsTitle
    |> selectWidget
    |> textDefault
    |> numberMultipleOf
    |> filter
    |> update('elements', map(legacyConfigSupport))
  );
}
