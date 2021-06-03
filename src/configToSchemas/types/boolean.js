import { useIntl } from 'react-intl';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import deprecate from 'util-deprecate';

const Switch = ({ onChange, options, schema, value }) => (
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

const booleanDefault = deprecate(
  ({ booleanDefault, ...other }) => ({ default: booleanDefault, ...other }),
  'field.booleanDefault is deprecated. Use field.default instead.'
);

export default ({ config }) => {
  if (config.booleanDefault) {
    config = booleanDefault(config);
  }

  const { default: defaults, booleanWidget, yes, no } = config;

  return {
    schema: {
      type: 'boolean',
      enumNames: [yes, no],
      default: defaults,
    },
    uiSchema: {
      'ui:widget': {
        0: 'radio',
        1: 'select',
        2: Switch,
        3: SwitchWithEmptyOption,
      }[booleanWidget],
    },
  };
};
