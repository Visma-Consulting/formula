/* eslint import/no-webpack-loader-syntax: "off" */
/* eslint import/no-unresolved: "off" */
import '!style-loader!css-loader!react-dates/lib/css/_datepicker.css';
import '!style-loader!css-loader!./style.css';
import { sub, add } from 'date-fns';
import moment from 'moment';
import 'moment/locale/fi';
import 'moment/locale/sv';
import { useEffect, useState } from 'react';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/initialize';
import { defineMessage, useIntl } from 'react-intl';

const beforeDay = (date) => {
  return date.type !== 'date' ? sub(new Date(), { [date.type]: date.value }) : date.value;
}

const afterDay = (date) => {
  return date.type !== 'date' ? add(new Date(), { [date.type]: date.value }) : date.value;
}

function SingleDatePickerWidget({ id, onChange, options, schema, value }) {
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
      <SingleDatePicker
        date={value === undefined ? null : moment(value)}
        onDateChange={(date) => date && onChange(date.format('YYYY-MM-DD'))}
        focused={focused}
        onFocusChange={handleFocusChange}
        id={id}
        disabled={schema.readOnly || options.readonly}
        placeholder={useLabel ? label : title}
        hideKeyboardShortcutsPanel
        isOutsideRange={(m) =>
          (options.disableBefore &&
            m.isBefore(beforeDay(options.element.disableBefore), 'day')) ||
          (options.disableAfter &&
            m.isAfter(afterDay(options.element.disableAfter), 'day'))
        }
      />
    </>
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
    }
  }
});

export const name = defineMessage({
  defaultMessage: 'Päivämäärä',
});

export const elementType = 'field';

export const widgets = [
  {
    value: 'days',
    message: defineMessage({
      defaultMessage: 'Päiviä',
    }),
  },
  {
    value: 'months',
    message: defineMessage({
      defaultMessage: 'Kuukausia',
    }),
  },
  {
    value: 'years',
    message: defineMessage({
      defaultMessage: 'Vuosia',
    }),
  },
  {
    value: 'date',
    message: defineMessage({
      defaultMessage: 'Päivämäärä',
    }),
  },
];
