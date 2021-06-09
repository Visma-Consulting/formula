import { utils } from '@visma/rjsf-core';
import { get } from 'lodash';
import { useContext, useMemo } from 'react';

function Bmi(props) {
  const { formData } = useContext(utils.Context);

  if (formData) {
    const path = props.id.split('_').slice(1, -1);
    const data = get(formData, path);

    if (data) {
      const weight = data.weight;
      const height = data.height;
      const bmi = useMemo(() => {
        return (weight / (height * height / 10000));
      }, [weight, height])
      return 'Painoindeksisi (BMI) = ' + bmi.toFixed(2) + ' kg/m2';
    } else {
      return 'Painoindeksikysymysryhmä toimii oikein, kun painoindeksikysymys lisätään lomakkeesseen ja lomakkeesta löytyy pituus ja paino-kysymykset.';
    }

  } else {
    return 'Painoindeksikysymys toimii oikein, kun lomakkeesta löytyy pituus ja paino-kysymykset.';
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
