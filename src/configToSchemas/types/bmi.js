import { utils } from '@visma/rjsf-core';
import { get } from 'lodash';
import { useContext, useEffect } from 'react';
import { defineMessage, FormattedMessage } from 'react-intl';

function Bmi(props) {
  const { formData } = useContext(utils.Context);
  const path = props.id.split('_').slice(1, -1);

  useEffect(() => {
    const data = get(formData, path);
    const height = data
      ? data[props.options.heightFieldKey]
      : formData
      ? formData[props.options.heightFieldKey]
      : null;
    const weight = data
      ? data[props.options.weightFieldKey]
      : formData
      ? formData[props.options.weightFieldKey]
      : null;

    const bmi =
      !isNaN(height) && !isNaN(weight)
        ? weight / ((height * height) / 10000)
        : NaN;
    setTimeout(() => {
      props.onChange(isNaN(bmi) ? undefined : bmi.toFixed(2));
    });
  }, [formData, path, props]);

  if (!isNaN(props.value) && props.value) {
    return (
      <FormattedMessage
        defaultMessage="{bmi} kg/m²"
        values={{ bmi: props.value }}
      />
    );
  }

  return (
    <>
      <FormattedMessage defaultMessage="Kysymysryhmässä tai lomakkeella pitää olla pituus- ja painokysymykset." />
    </>
  );
}

export default (props) => {
  const heightFieldKey = props.config?.bmiFieldKeys?.heightFieldKey ?? 0;
  const weightFieldKey = props.config?.bmiFieldKeys?.weightFieldKey ?? 1;
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
