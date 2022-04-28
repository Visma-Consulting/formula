import { defineMessage } from 'react-intl';
import { Typography, Checkbox, FormControlLabel } from '@material-ui/core';


function CheckboxWidget({ options, onChange, value }) {
  const consentMessage = options.element.yes;
  return (
    <>
      <Typography variant="subtitle1"> {options.element.useLabel ? options.element.label : options.element.title}</Typography>
      <br/>
      {/* eslint-disable-next-line no-mixed-operators */}
      {options.element.useLabel === false || options.element.useLabel === undefined && (
        <Typography variant="subtitle1" >{options.element.label}</Typography>
      )}

      <FormControlLabel
        control={
          <Checkbox
            onChange={(event, value) => {
              value === null ? onChange(undefined) : onChange(value);
            }}
            checked={value}
          />
        }
        label={consentMessage}/>
    </>
  );
}
export default () => {
  return {
    schema: {
      type: 'boolean',
      enum: [true],
      default: false,
    },
    uiSchema: {
      'ui:widget': CheckboxWidget,
    }
  }
};

export const name = defineMessage({
  defaultMessage: 'Suostumus',
});

export const elementType = 'field';


