import { Typography, Checkbox, FormControlLabel } from '@material-ui/core';
import { defineMessage, useIntl } from 'react-intl';
import { useState } from 'react';

function CheckboxWidget({ id, options, schema }) {
  const intl = useIntl();
  const [checked, setChecked] = useState(false);

  const { title, label, useLabel } = schema;

  const handleChange = (e) => {
    setChecked(e.target.checked);
  }

  return (
    <>
      <Typography variant="subtitle1">{options.description}</Typography>
      <FormControlLabel
        control={
          <Checkbox
            key={id}
            checked={checked}
            onChange={handleChange}
            label={label}
          />
        }
        label={title}/>
    </>
  );
}

export default () => {

  return {
    schema: {
      type: 'boolean',
    },
    uiSchema: {
      'ui:widget': CheckboxWidget,
    },
  };
};


export const name = defineMessage({
  defaultMessage: 'Suostumus',
});

export const elementType = 'field';


