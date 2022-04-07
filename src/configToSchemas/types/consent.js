import { defineMessage } from 'react-intl';
import { Typography, Checkbox, FormControlLabel } from '@material-ui/core';


function CheckboxWidget({ options, onChange }) {
  const consentMessage = options.element.yes;
  return (
    <>
      <Typography variant="subtitle1" >{options.element.label ? options.element.label : options.element.title}</Typography>
      <FormControlLabel
        control={
          <Checkbox
            onChange={(event, value) => {
              onChange(value);
            }}
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


