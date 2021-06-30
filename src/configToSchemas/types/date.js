import { useEffect, useState } from 'react';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/initialize';
import moment from 'moment';
import { defineMessage, useIntl } from 'react-intl';
/* eslint import/no-webpack-loader-syntax: "off" */
/* eslint import/no-unresolved: "off" */
import '!style-loader!css-loader!react-dates/lib/css/_datepicker.css';
import 'moment/locale/fi';
import 'moment/locale/sv';

const parseToday = (date) => (date === 'today' ? moment() : moment(date));

function SingleDatePickerWidget({ id, onChange, options, schema, value }) {
  const intl = useIntl();
  const [focused, setFocused] = useState();

  const handleFocusChange = ({ focused }) => setFocused(focused);

  const { locale } = intl;

  useEffect(() => {
    moment.locale(locale);
  }, [locale]);

  return (
    <SingleDatePicker
      date={value === undefined ? null : moment(value)}
      onDateChange={(date) => date && onChange(date.format('YYYY-MM-DD'))}
      focused={focused}
      onFocusChange={handleFocusChange}
      id={id}
      disabled={schema.readOnly || options.readonly}
      placeholder={intl.formatMessage({ defaultMessage: 'Päivämäärä' })}
      hideKeyboardShortcutsPanel
      isOutsideRange={(m) =>
        (options.disableBefore &&
          m.isBefore(parseToday(options.disableBefore), 'day')) ||
        (options.disableAfter &&
          m.isAfter(parseToday(options.disableAfter), 'day'))
      }
    />
  );
}

export default ({ config: { disableBefore, disableAfter } }) => ({
  schema: {
    format: 'date',
    type: 'string',
  },
  uiSchema: {
    'ui:widget': SingleDatePickerWidget,
    'ui:options': {
      disableBefore,
      disableAfter,
    },
  },
});

export const name = defineMessage({
  defaultMessage: 'Päivämäärä',
});

export const elementType = 'field';
