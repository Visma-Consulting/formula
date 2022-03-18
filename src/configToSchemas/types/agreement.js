import { Typography } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { defineMessage, useIntl } from 'react-intl';
import { ensureValueIsAvailable } from '../../utils';

const Switch = ({ onChange, options, schema, value }) => (
  <>
    <Typography variant="subtitle1">{schema.title}</Typography>
    <ToggleButtonGroup
      exclusive
      value={value}
      onChange={(event, value) => {
        onChange(value);
      }}
    >
      {options.enumOptions.map(({ label, value }, index) => (
        <ToggleButton
          key={index}
          value={value}
          disabled={schema.readOnly || options.readonly}
        >
          {label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  </>
);

const NOTHING = 'nothing';

const SwitchWithEmptyOption = ({ onChange, options, value, ...other }) => {
  return (
    <Switch
      onChange={(value) => onChange(value === NOTHING ? undefined : value)}
      options={{
        ...options,
        enumOptions: [
          {
            label: useIntl().formatMessage({ defaultMessage: 'Ei valintaa' }),
            value: NOTHING,
          },
          ...options.enumOptions,
        ],
      }}
      value={value ?? NOTHING}
      {...other}
    />
  );
};
export default ({ config }) => {
  const { default: defaults, yes, no } = config;



  return {
    schema: {
      type: 'agreement',
      enumNames: [yes, no],
      default: defaults,
    },
    uiSchema: {
    },
  };
};

export const name = defineMessage({
  defaultMessage: 'Suostumus',
});

export const elementType = 'field';


