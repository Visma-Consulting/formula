import { Typography } from '@material-ui/core';
import { utils } from '@visma/rjsf-core';
import { get } from 'lodash';
import { useContext, useEffect } from 'react';
import { defineMessage, FormattedMessage } from 'react-intl';

function Bmi(props) {
  const { formData } = useContext(utils.Context);
  const path = props.id.split('_').slice(1, -1);

  useEffect(() => {
    const data = get(formData, path);
    const height = data[props.options.heightFieldKey];
    const weight = data[props.options.weightFieldKey];

    const bmi = weight / ((height * height) / 10000);
    setTimeout(() => {
      props.onChange(isNaN(bmi) ? '' : bmi.toFixed(2));
    });
  }, [formData, path, props]);

  if (!isNaN(props.value) || !props.value) {
    return (
      <>
        <Typography variant="subtitle1" color="texSecondary">
          {props.label}
        </Typography>
        <FormattedMessage
          defaultMessage="{bmi} kg/m²"
          values={{ bmi: props.value }}
        />
      </>
    );
  }

  return (
    <>
      <Typography variant="subtitle1" color="texSecondary">
        {props.label}
      </Typography>
      <FormattedMessage defaultMessage="Painoindeksikysymys toimii oikein, kun samasta kysymysryhmästä löytyy ensimmäisenä pituuskysymys ja toisena painokysymys. Mitään muuta ei saa olla samassa kysymysryhmässä." />
    </>
  );
}

export default (props) => {
  const {
    config: { heightFieldKey = 0, weightFieldKey = 1 },
  } = props;
  return {
    schema: {
      type: 'string',
    },
    uiSchema: {
      'ui:widget': Bmi,
      'ui:options': {
        heightFieldKey,
        weightFieldKey,
        unit: 'kg/m²',
      },
    },
  };
};

export const name = defineMessage({
  defaultMessage: 'Painoindeksi',
});

export const elementType = 'field';
