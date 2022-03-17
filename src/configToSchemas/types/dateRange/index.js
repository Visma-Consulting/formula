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
  const { idSchema, onChange, schema, formData, uiSchema, config } = props;
  const intl = useIntl();
  const [focusedInput, setFocusedInput] = useState();
  const { disableEnd, disableStart } = props.uiSchema['ui:options'].element;
  const handleFocusChange = (focusedInput) => setFocusedInput(focusedInput);
  const { locale } = intl;

  useEffect(() => {
    moment.locale(locale);
  }, [locale]);

  const earliestEndDate = () => {
    if(beforeDay(disableStart.disableBefore) > beforeDay(disableEnd.disableBefore)) {
      console.log(beforeDay(disableStart.disableBefore));
      return beforeDay(disableStart.disableBefore);
    } else {
      console.log(beforeDay(disableEnd.disableBefore));
      return beforeDay(disableEnd.disableBefore);
    }
  }

  const beforeDay = (date) => {
    if(date.type !== undefined) {
      return date.type !== 'date' ? sub(new Date(), { [date.type]: date.numberValue }) : new Date(date.dateValue);
    } else {
      return null;
    }
  }

  const afterDay = (date) => {
    if(date.type !== undefined) {
      return date.type !== 'date' ? add(new Date(), { [date.type]: date.numberValue }) : new Date(date.dateValue);
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
        isOutsideRange={(m) => focusedInput === 'startDate' ?
          (disableStart.disableBefore.type &&
            m.isBefore(beforeDay(disableStart.disableBefore), 'day')) ||
          (disableStart.disableAfter.type &&
            m.isAfter(afterDay(disableStart.disableAfter), 'day')) :
          (disableEnd.disableBefore.type &&
              m.isBefore(earliestEndDate(), 'day')) ||
          (disableEnd.disableAfter.type &&
            m.isAfter(afterDay(disableEnd.disableAfter), 'day'))
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

