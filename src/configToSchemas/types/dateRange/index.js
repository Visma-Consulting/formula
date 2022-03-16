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
import { add, sub } from 'date-fns';

function DateRangePickerField(props) {
  const { idSchema, onChange, schema, formData, uiSchema } = props;
  const intl = useIntl();
  const [focusedInput, setFocusedInput] = useState();
  const { disableBefore, disableAfter } = props.uiSchema['ui:options'];
  const handleFocusChange = (focusedInput) => setFocusedInput(focusedInput);
  const { locale } = intl;

  useEffect(() => {
    moment.locale(locale);
  }, [locale]);

  const beforeDay = (date) => {
    if(date.type !== undefined) {
      return date.type !== 'date' ? sub(new Date(), { [date.type]: date.numberValue }) : date.dateValue;
    } else {
      return null;
    }
  }

  const afterDay = (date) => {
    if(date.type !== undefined) {
      return date.type !== 'date' ? add(new Date(), { [date.type]: date.numberValue }) : date.dateValue;
    } else {
      return null;
    }
  }

  return (
    <>
      <props.registry.FieldTemplate
        {...props}
        schema={{...props.schema, type: 'string'}}
        >
      <DateRangePicker
        onDatesChange={({ startDate, endDate }) => (startDate || endDate) && onChange({ start: startDate?.format('YYYY-MM-DD'), end: endDate?.format('YYYY-MM-DD')})}
        onFocusChange={handleFocusChange}
        focusedInput={focusedInput}
        disabled={schema.readOnly || uiSchema.readonly}
        hideKeyboardShortcutsPanel
        startDate={formData?.start === undefined ? null : moment(formData?.start)}
        startDateId={idSchema.start.$id}
        endDate={formData?.end === undefined ? null : moment(formData?.end)}
        endDateId={idSchema.end.$id}
        isOutsideRange={(m) =>
          (disableBefore && disableBefore.type &&
            m.isBefore(beforeDay(disableBefore), 'day')) ||
          (disableAfter && disableAfter.type &&
            m.isAfter(afterDay(disableAfter), 'day'))
        }
      />
      </props.registry.FieldTemplate>
    </>
  );
}

export default ({ config: { disableBefore, disableAfter } }) => ({
  schema: {
    type: 'object',
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
