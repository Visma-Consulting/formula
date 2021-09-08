import booleanDefault from './booleanDefault';
import booleanWidget from './booleanWidget';
import formgroupType from './formgroupType';
import multiselectWidget from './multiselectWidget';
import nameAsTitle from './nameAsTitle';
import selectWidget from './selectWidget';
import textDefault from './textDefault';
import { map, update } from 'lodash/fp';

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
    |> update('elements', map(legacyConfigSupport))
  );
}
