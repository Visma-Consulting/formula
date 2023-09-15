import * as React from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { defineMessage } from 'react-intl';
import { sortChoices } from '../../utils';
import { Typography } from '@material-ui/core';
import { utils } from '@visma/rjsf-core';

function DefaultSelect(props) {
  const { id, options, value, onChange, label, onBlur, onFocus, uiSchema, required} = props;
  const choicesSorted = sortChoices(options?.element?.choices, options?.element?.autoSort);
  const scoreObject = uiSchema["ui:options"]?.showScore ? choicesSorted.find( choice => choice.enum === value) : undefined

  return (
    <div style={{display: 'flex'}}>
      <div style={{flex: '1 1'}}>
        <Box>
          <FormControl variant="standard" sx={{ minWidth: '100%' }}>
            <Select
              id={id}
              value={value || ''}
              label={label}
              aria-label={utils.generateAriaLabel(label, options, required)}
              onBlur={onBlur}
              onFocus={onFocus}
              onChange={(e) => onChange(e.target.value)}
              role="combobox"
              inputProps={{
                'aria-labelledby': id,
              }}
              InputLabelProps={{'aria-label': 'age selection'}}
            >
              {choicesSorted?.map((choice) => (
                <MenuItem key={choice.enum} value={choice.enum}>
                  {choice.enumNames}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </div>
          { (uiSchema["ui:options"]?.showScore && value && scoreObject) &&
          <Typography>
            {scoreObject.meta.score}
          </Typography>
          }
    </div>
  );
}
export default ({ config, fillProps }) => {
  const choices = config.choices !== null ? config.choices : [];
  const autoSort = false;
  const choicesSorted = sortChoices(choices, autoSort);
  return {
    schema: {
      type: 'string',
      default: undefined,
      enum: choicesSorted.map((v, i) => v?.enum ?? String(i)),
      enumNames: choicesSorted.map((v) =>
        typeof v === 'object' ? v.enumNames : v
      ),
    },
    uiSchema: {
      'ui:placeholder': config.placeholder,
      'ui:enumDisabled': config.choicesDisabled,
      'ui:widget': (config?.type === 'select' && config.widget === undefined) ? DefaultSelect : config?.widget?.endsWith('Row') ? config.widget.slice(0,-3) : config.widget,
      'ui:options': {
        inline: config?.widget && config?.widget.endsWith('Row'),
        showScore: fillProps?.showScores
      }
    },
  }};

export const name = defineMessage({
  defaultMessage: 'Valinta',
});

export const elementType = 'field';

export const widgets = [
  {
    value: 'select',
    message: defineMessage({
      defaultMessage: 'Valintalista',
    }),
  },
  {
    value: 'radio',
    message: defineMessage({
      defaultMessage: 'Radiopainikkeet allekkain',
    }),
  },
  {
    value: 'radioRow',
    message: defineMessage({
      defaultMessage: 'Radiopainikkeet rivissä',
    }),
  },
];

