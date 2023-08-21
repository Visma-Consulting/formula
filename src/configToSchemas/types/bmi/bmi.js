import { utils } from '@visma/rjsf-core';
import { get } from 'lodash';
import { useContext, useEffect, useState } from 'react';
import { defineMessage, useIntl } from 'react-intl';
import { Typography } from '@material-ui/core';
import bmi_male from './bmi_male';
import bmi_female from './bmi_female';

const getTable = (csvTableString) => {
  const csvTableArray = csvTableString.split('\n');
  const keys = csvTableArray[0].split(',');
  const finalTableArray = csvTableArray.slice(1, csvTableArray.length).map((item) => {
    const object = {};
    const itemArray = item.split(',');
    for (const index in keys) {
      object[keys[index]] = Number(itemArray[index]);
    }
    return object;
  })
  return finalTableArray;
}

const getChildBmi = (age, bmi, table) => {
  const row = table.find(el => el.age === Math.round((age + Number.EPSILON) * 100)/100);
  if (row) {
    const {mu, sigma, nu} = row;
    // Käytetään vertailuarvoina 18 vuotiaan mu, sigma ja nu arvoja
    const {mu: M, sigma: S, nu: L} = table.find(el => el.age === 18);
    const zScore = (Math.pow((bmi/mu), nu) -1 )/(nu * sigma);
    const childBmi = M * Math.pow(1 + L * S * zScore, 1/L);
    return childBmi;
  }
  return NaN;
}

function Bmi(props) {
  const intl = useIntl();
  const { formData } = useContext(utils.Context);
  const path = props.id.split('_').slice(1, -1);
  const [ data, setData ] = useState(props.value);

  useEffect(() => {
    setTimeout(() => {
      props.onChange(isNaN(data) ? undefined : data.toFixed(2));
    });
  }, [data])

  useEffect(async () => {
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
    if (props.options.type === 'child') {
      const gender = data
        ? data[props.options.genderFieldKey]
        : formData
          ? formData[props.options.genderFieldKey]
          : null;
      const birthday = data
        ? data[props.options.birthdayFieldKey]
        : formData
          ? formData[props.options.birthdayFieldKey]
          : null;
      const measuringDay = data
        ? data[props.options.measuringDayFieldKey]
        : formData
          ? formData[props.options.measuringDayFieldKey]
          : null;
      let age;
      if (birthday && measuringDay) {
        try {
          const birthdayDate = new Date(birthday);
          const measuringDayDate = new Date(measuringDay);
          age = (measuringDayDate - birthdayDate)/(1000 * 60 * 60 * 24 * 365.25);
        } catch (e) {
          console.error(e)
        }
      }
      if (gender !== undefined && age && !Number.isNaN(bmi)) {
        const table = gender === '1' ? bmi_female : bmi_male;
        const childBmi = getChildBmi(age, bmi, getTable(table));
        setData(childBmi);
      } else {
        setTimeout(() => {
          setData(NaN);
        });
      }
    } else {
      setTimeout(() => {
        setData(bmi);
      });
    }
  }, [formData, path, props]);

  if (!isNaN(props.value) && props.value) {
    const valueString = intl.formatMessage({defaultMessage: "{bmi} kg/m²"}, {bmi: props.value});

    return (
      <span aria-label={`${intl.formatMessage({defaultMessage: 'Painoindeksi'})}: ${valueString}`}>
        {valueString}
      </span>
    );
  }

  return (<Typography>-</Typography>);
}

export default (props) => {
  const heightFieldKey = props.config?.bmiFieldKeys?.heightFieldKey ?? 0;
  const weightFieldKey = props.config?.bmiFieldKeys?.weightFieldKey ?? 1;
  const genderFieldKey = props.config?.bmiFieldKeys?.genderFieldKey;
  const birthdayFieldKey = props.config?.bmiFieldKeys?.birthdayFieldKey;
  const measuringDayFieldKey = props.config?.bmiFieldKeys?.measuringDayFieldKey;
  const type = props.config?.bmiFieldKeys?.bmiType;
  return {
    schema: {
      type: 'string',
    },
    uiSchema: {
      'ui:widget': Bmi,
      'ui:options': {
        heightFieldKey,
        weightFieldKey,
        genderFieldKey,
        birthdayFieldKey,
        measuringDayFieldKey,
        type,
        unit: 'kg/m²',
      },
    },
  };
};

export const name = defineMessage({
  defaultMessage: 'Painoindeksi',
});

export const elementType = 'field';
