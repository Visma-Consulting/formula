import { utils } from '@visma/rjsf-core';
import { get } from 'lodash';
import { useContext, useMemo } from 'react';
import { defineMessage, FormattedMessage } from 'react-intl';

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
      return <FormattedMessage defaultMessage="Painoindeksisi (BMI) = {bmi} kg/m²"
                               values={{bmi: bmi.toFixed(2)}}/>;
    }
  }

  return <FormattedMessage defaultMessage="Painoindeksikysymys toimii oikein, kun samasta kysymysryhmästä löytyy pituus- ja painokysymykset." />;
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

export const name = defineMessage({
  defaultMessage: 'Painoindeksi',
});

export const elementType = 'field';
