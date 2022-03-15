/* eslint import/no-webpack-loader-syntax: "off" */
/* eslint import/no-unresolved: "off" */
import '!style-loader!css-loader!react-dates/lib/css/_datepicker.css';
import '!style-loader!css-loader!./style.css';
import moment from 'moment';
import 'moment/locale/fi';
import 'moment/locale/sv';
import { useEffect, useState } from 'react';
import { DateRangePicker } from 'react-dates';
import 'react-dates/initialize';
import { defineMessage, useIntl } from 'react-intl';

const parseToday = (date) => (date === 'today' ? moment() : moment(date));
/*
function DateRangePickerField(props) {
  console.log(props);
  return 123;
}
*/

function DateRangePickerField({ id, onChange, options, schema, formData, uiSchema }) {
  const intl = useIntl();
  const [focusedInput, setFocusedInput] = useState();
  const { disableBefore, disableAfter } = uiSchema['ui:options'];
  const { title, label, useLabel } = uiSchema['ui:options'].element;
  const handleFocusChange = (focusedInput) => setFocusedInput(focusedInput);
  const { locale } = intl;

  useEffect(() => {
    moment.locale(locale);
  }, [locale]);

  return (
    <>
      <DateRangePicker
        onDatesChange={({ startDate, endDate }) => (startDate || endDate) && onChange({ start: startDate?.format('YYYY-MM-DD'), end: endDate?.format('YYYY-MM-DD')})}
        onFocusChange={handleFocusChange}
        focusedInput={focusedInput}
        id={id}
        disabled={schema.readOnly || uiSchema.readonly}
        placeholder={useLabel ? label : title}
        hideKeyboardShortcutsPanel
        startDate={formData?.start === undefined ? null : moment(formData?.start)}
        endDate={formData?.end === undefined ? null : moment(formData?.end)}
        isOutsideRange={(m) =>
          (disableBefore &&
            m.isBefore(parseToday(disableBefore), 'day')) ||
          (disableAfter &&
            m.isAfter(parseToday(disableAfter), 'day'))
        }
      />
    </>
  );
}

export default ({ config: { disableBefore, disableAfter } }) => ({
  schema: {
    type: 'string',
    properties: {
      start: {
        format: 'date',
        type: 'string',
      },
      end: {
        format: 'date',
        type: 'string',
      }
    }
  },
  uiSchema: {
    'ui:field': DateRangePickerField,
    'ui:options': {
      disableBefore,
      disableAfter,
    },
  },
});

export const name = defineMessage({
  defaultMessage: 'Päivämäärähaarukka',
});

export const elementType = 'field';
