import { utils } from '@visma/rjsf-core';
import { get } from 'lodash';
import { useContext, useEffect, useMemo, useState } from 'react';
import { defineMessage, FormattedMessage } from 'react-intl';
import { Typography } from '@material-ui/core';

function Bmi(props) {
  const { formData } = useContext(utils.Context);
  const [height, setHeight] = useState();
  const [weight, setWeight] = useState();

  useEffect(() => {
    if (formData && formData !== 'NaN') {
      const path = props.id.split('_').slice(1, -1);
      const data = get(formData, path);

      if (data) {
        setHeight(data[Object.keys(data)[0]]);
        setWeight(data[Object.keys(data)[1]]);
      } else if (Object.keys(formData).length >= 2) {
        setHeight(formData[Object.keys(formData)[0]]);
        setWeight(formData[Object.keys(formData)[1]]);
      } else {
        setWeight(10);
        setHeight(50);
      }
    }
  }, [formData])

  useEffect(() => {
    props.onChange((weight / (height * height / 10000)).toFixed(2));
  }, [height, weight])

  if (!isNaN(props.value) || !props.value) {
    return (<>
      <Typography variant="subtitle1" color="texSecondary">{props.label}</Typography>
      <FormattedMessage defaultMessage="{bmi} kg/m²"
                        values={{bmi: props.value}}/>
    </>);
  }

  return (<>
    <Typography variant="subtitle1" color="texSecondary">{props.label}</Typography>
    <FormattedMessage defaultMessage="Painoindeksikysymys toimii oikein, kun samasta kysymysryhmästä löytyy ensimmäisenä pituuskysymys ja toisena painokysymys. Mitään muuta ei saa olla samassa kysymysryhmässä." />
  </>);
}

export default (props) => {
  return {
    schema: {
      type: 'string',
    },
    uiSchema: {
      'ui:widget': Bmi,
      'ui:options': {
        unit: 'kg/m²'
      },
    },
  };
};

export const name = defineMessage({
  defaultMessage: 'Painoindeksi',
});

export const elementType = 'field';
