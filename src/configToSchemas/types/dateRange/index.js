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

function DateRangePickerWidget({ id, onChange, options, schema, value }) {
  const intl = useIntl();
  const [focused, setFocused] = useState();
  const { title, label, useLabel } = options.element;

  const handleFocusChange = ({ focused }) => setFocused(focused);

  const { locale } = intl;

  useEffect(() => {
    moment.locale(locale);
  }, [locale]);

  return (
    <>
      <DateRangePicker

        onDateChange={(date) => date && onChange(date.format('YYYY-MM-DD'))}
        focused={focused}
        onFocusChange={handleFocusChange}
        id={id}
        disabled={schema.readOnly || options.readonly}
        placeholder={useLabel ? label : title}
        hideKeyboardShortcutsPanel
        isOutsideRange={(m) =>
          (options.disableBefore &&
            m.isBefore(parseToday(options.disableBefore), 'day')) ||
          (options.disableAfter &&
            m.isAfter(parseToday(options.disableAfter), 'day'))
        }
        startDate={value === undefined ? null : moment(value)}// momentPropTypes.momentObj or null,
        startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
        endDate={value === undefined ? null : moment(value)}// momentPropTypes.momentObj or null,
        endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
        onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })} // PropTypes.func.isRequired,
        focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,

      />
    </>
  );
}

export default ({ config: { disableBefore, disableAfter } }) => ({
  schema: {
    format: 'dateRange',
    type: 'string',
  },
  uiSchema: {
    'ui:widget': DateRangePicker,
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
