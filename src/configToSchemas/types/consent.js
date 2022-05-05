import { defineMessage } from 'react-intl';
import { Typography, Checkbox, FormControlLabel } from '@material-ui/core';


function CheckboxWidget({ options, onChange, value, id }) {
  const consentMessage = options.element.yes;
  const headerNumber = id?.split('_').length + 1;
  return (
    <>
      <Typography component={headerNumber < 5 ? `h${headerNumber}` : 'h6'} variant="subtitle1">
        {options.element.useLabel ? options.element.label : options.element.title}
      </Typography>
      <br/>
      {(options.element.useLabel === false || options.element.useLabel === undefined)&& (
        <Typography component="span" variant="subtitle1" >{options.element.label}</Typography>
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


