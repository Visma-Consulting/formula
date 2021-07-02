import React from 'react';
import { Autocomplete } from '@material-ui/lab';
import { TextField, Chip } from '@material-ui/core';

export const types = ['select', 'multiselect'];

function AutocompleteField(props) {
  return (
    <Autocomplete
      multiple
      options={props.schema.items.enumNames}
      value={props.formData ?? []}
      onChange={(event, value) => props.onChange(value)}
      freeSolo
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip variant="outlined" label={option} {...getTagProps({ index })} />
        ))
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

export const converter = (config) => (props) => {
  if (config.autocomplete) {
    // Allow values outside the choices
    delete props.schema.items.enum;

    props.uiSchema ??= {};
    props.uiSchema['ui:field'] = AutocompleteField;

    // To let AutocompleteField know if this is select or multiselect
    // For now only multiselect is supported
    // props.uiSchema['ui:options'] ??= {};
    // props.uiSchema['ui:options'].type = config.type;
  }
};
