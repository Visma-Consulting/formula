import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

export const types = ['select'];

export function AutocompleteSelectField(props) {
  return (
    <Autocomplete
      options={props.schema.enumNames}
      value={props.schema.enumNames[props.schema.enum.indexOf(props.formData)]}
      onChange={(event, value) =>
        props.onChange(props.schema.enum[props.schema.enumNames.indexOf(value)])
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.schema.title}
          placeholder={props.schema.title}
        />
      )}
    />
  );
}

export const converter =
  ({ config }) =>
  (props) => {
    if (config.autocomplete) {
      props.uiSchema ??= {};
      props.uiSchema['ui:field'] = AutocompleteSelectField;
    }
  };
