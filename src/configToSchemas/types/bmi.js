import { utils } from '@visma/rjsf-core';
import { get } from 'lodash';
import { useContext, useMemo } from 'react';

function Bmi(props) {
  const { formData } = useContext(utils.Context);

  if (formData) {
    const path = props.id.split('_').slice(1, -1);
    const data = get(formData, path);
    let height, weight;

    if (data) {
      height = data[props.options.heightFieldKey];
      weight = data[props.options.weightFieldKey];
    } else if (formData.height && formData.weight) {
      height = formData[props.options.heightFieldKey];
      weight = formData[props.options.weightFieldKey];
    }

    if (height && weight) {
      const bmi = useMemo(() => {
        return (weight / (height * height / 10000));
      }, [weight, height])
      return 'Painoindeksisi (BMI) = ' + bmi.toFixed(2) + ' kg/m2';
    } else {
      return 'Painoindeksikysymys toimii oikein, kun samasta kysymysryhmästä löytyy pituus- ja painokysymykset.';
    }
  } else {
    return 'Painoindeksikysymys toimii oikein, kun samasta kysymysryhmästä löytyy pituus- ja painokysymykset.';
  }
}

export default (props) => {
  const {
    config: { heightFieldKey, weightFieldKey },
  } = props;
  return {
    schema: {
      type: 'number',
    },
    uiSchema: {
      'ui:widget': Bmi,
      'ui:options': {
        heightFieldKey,
        weightFieldKey,
      },
    },
  };
};
