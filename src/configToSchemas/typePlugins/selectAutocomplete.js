import React, { useState, useEffect } from 'react';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';

export const types = ['select'];

export function AutocompleteSelectField(props) {
  const options = props.schema.enum;
  const optionNames = props.schema.enumNames;
  const initialValue = props.formData;
  const initialIndex = options.indexOf(initialValue);

  const [ choice, setChoice ] = useState(initialValue ?? null);
  const [ choiceName, setChoiceName ] = useState(initialIndex >= 0 ? optionNames[initialIndex] : null);

  const updateChoice = (value) => {
    setChoiceName(value);
    setChoice(options[optionNames.indexOf(value)]);
  }

  useEffect(() => {
    props.onChange(choice);
  }, [choice])

  return (
    <Autocomplete
      options={optionNames}
      value={choiceName}
      onChange={(event, value) => updateChoice(value)}
      freeSolo
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

export const converter = ( {config} ) => (props) => {
  if (config.autocomplete) {
    props.uiSchema ??= {};
    props.uiSchema['ui:field'] = AutocompleteSelectField;
  }
};

