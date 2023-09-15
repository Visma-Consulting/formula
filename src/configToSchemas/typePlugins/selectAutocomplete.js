import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { utils } from '@visma/rjsf-core';
import produce from 'immer';
import { useContext } from 'react';

export const types = ['select', 'selectV2'];

export function AutocompleteSelectField(props) {
  return (
    <Autocomplete
      options={props.schema.enumNames}
      aria-label={utils.generateAriaLabel(props.schema.title, props.uiSchema['ui:options'], props.schema.required)}
      value={props.schema.enumNames[props.schema.enum.indexOf(props.formData)]}
      onChange={(event, value) =>
        props.onChange(props.schema.enum[props.schema.enumNames.indexOf(value)])
      }
      getOptionSelected={(option, value) => option === value}
      renderInput={(params) => <TextField {...params} />}
    />
  );
}

const isSameType = (a) => (b) => a?.type === b.type;
const isNotSameId = (a) => (b) => a.id !== b.id;

function UniqueItemsInFormGroupList(props) {
  const { formData } = useContext(utils.Context);
  const idParts = props.idSchema.$id.split('_');
  const index = Number(idParts[idParts.length - 2]);
  const { elements } = formData;
  const element = elements[index];
  const illegalIds = elements
    .filter(isSameType(element))
    .filter(isNotSameId(element))
    .map((element) => element.id);
  const enumValues = [];
  const enumNames = [];

  // eslint-disable-next-line @super-template/no-loops/no-loops
  for (let i = 0; i < props.schema.enum.length; ++i) {
    const enumValue = props.schema.enum[i];
    if (!illegalIds.includes(enumValue)) {
      enumValues.push(enumValue);
      enumNames.push(props.schema.enumNames[i]);
    }
  }

  return (
    <AutocompleteSelectField
      {...produce(props, (props) => {
        props.schema.enum = enumValues;
        props.schema.enumNames = enumNames;
      })}
    />
  );
}

export const converter =
  ({ config }) =>
  (props) => {
    if (config.autocomplete) {
      props.uiSchema ??= {};
      props.uiSchema['ui:field'] = config.uniqueItemsInFormGroupList
        ? UniqueItemsInFormGroupList
        : AutocompleteSelectField;
    }
  };
