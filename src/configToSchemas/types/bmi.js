import { utils } from '@visma/rjsf-core';
import { get } from 'lodash';
import { useContext, useEffect, useMemo, useState } from 'react';
import { defineMessage, FormattedMessage } from 'react-intl';

function Bmi(props) {
  const { formData } = useContext(utils.Context);
  const [height, setHeight] = useState();
  const [weight, setWeight] = useState();

  useEffect(() => {
    if (formData && formData !== 'NaN') {
      const path = props.id.split('_').slice(1, -1);
      const data = get(formData, path);

      if (data) {
        setHeight(data[props.options.heightFieldKey]);
        setWeight(data[props.options.weightFieldKey]);
      } else if (formData.height && formData.weight) {
        setHeight(formData[props.options.heightFieldKey]);
        setWeight(formData[props.options.weightFieldKey]);
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
    return <FormattedMessage defaultMessage="Painoindeksisi (BMI) = {bmi} kg/m²"
                             values={{bmi: props.value}}/>;
  }

  return <FormattedMessage defaultMessage="Painoindeksikysymys toimii oikein, kun samasta kysymysryhmästä löytyy pituus- ja painokysymykset." />;
}

export default (props) => {
  const {
    config: { heightFieldKey, weightFieldKey },
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
        unit: 'kg/m²'
      },
    },
  };
};

export const name = defineMessage({
  defaultMessage: 'Painoindeksi',
});

export const elementType = 'field';
