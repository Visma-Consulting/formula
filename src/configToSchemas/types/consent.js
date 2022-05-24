import { defineMessage } from 'react-intl';
import { Typography, Checkbox, FormControlLabel } from '@material-ui/core';


function CheckboxWidget({ options, onChange, value, id }) {
  const required = options.element?.required;
  const useLabel = options.element?.useLabel;
  const label = options.element?.label;
  const consentMessage = options.element?.yes;
  const headerNumber = id?.split('_').length + 1;
  const title = (useLabel ? label : options.element.title) + (required ? ' *' : '');
  return (
    <>
      <Typography component={headerNumber < 5 ? `h${headerNumber}` : 'h6'} variant="subtitle1">
        {title}
      </Typography>
      <br/>
      {(useLabel === false || useLabel === undefined)&& (
        <Typography component="span" variant="subtitle1" >{label}</Typography>
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


