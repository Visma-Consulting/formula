import { FormHelperText, Typography } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { defineMessage, useIntl } from 'react-intl';
import { ensureValueIsAvailable } from '../../utils';

const Switch = ({ onChange, options, schema, value }) => {
  const title = options.element.required ? schema.title + ' *' : schema.title;
  return(
    <>
      <Typography component="label" variant="subtitle1">{title}</Typography>
      {options?.element?.list ? <></> : <FormHelperText component="span" variant="contained" >{options?.element?.description}</FormHelperText> }
      <ToggleButtonGroup
        exclusive
        value={value}
        onChange={(event, value) => {
          value === null ? onChange(undefined) : onChange(value);
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
}

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

  const widget = config.widget
    ? ensureValueIsAvailable(
      config.widget.endsWith('Row')
        ? config.widget.slice(0,-3)
        : config.widget, widgets)
    : undefined;

  return {
    schema: {
      type: 'boolean',
      enumNames: [yes, no],
      default: defaults,
    },
    uiSchema: {
      'ui:widget':
        {
          switch: Switch,
          switchWithEmptyOption: SwitchWithEmptyOption,
        }[widget] ?? widget,
      'ui:options': {
        inline: config.widget && config.widget.endsWith('Row')
      }
    },
  };
};

export const name = defineMessage({
  defaultMessage: 'Totuusarvo',
});

export const elementType = 'field';

export const widgets = [
  {
    value: 'checkbox',
    message: defineMessage({
      defaultMessage: 'Valintaruutu',
    }),
  },
  // Not available: https://github.com/rjsf-team/react-jsonschema-form/issues/2326
  // {
  //   value: 'select',
  //   message: defineMessage({
  //     defaultMessage: 'Valintalista',
  //   }),
  // },
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
  {
    value: 'switch',
    message: defineMessage({
      defaultMessage: 'Painikkeet',
    }),
  },
  {
    value: 'switchWithEmptyOption',
    message: defineMessage({
      defaultMessage: 'Painikkeet tyhjällä valinnalla',
    }),
  },
];
