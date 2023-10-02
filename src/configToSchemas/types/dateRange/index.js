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
import { defineMessage, FormattedMessage, useIntl } from 'react-intl';
import { add, sub } from 'date-fns';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { mapValues } from 'lodash';
import { DateRangePickerPhrases } from '../../../../lib/configToSchemas/types/date/phrases';
import { getAriaLabel } from '../../../utils.js';
import { utils } from '@visma/rjsf-core';

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(1),
      marginLeft: '0px',
    },
  },
  dateBox: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'start',
      '& input::placeholder': {
        fontSize: '13px',
      },
    },
  }
}));

function DateRangePickerField(props) {
  const { idSchema, onChange, schema, formData, uiSchema, required, rawErrors } = props;
  const intl = useIntl();
  const [focusedInput, setFocusedInput] = useState();
  const { element: {disableEnd, disableStart}, dateFormat } = props.uiSchema['ui:options'];
  const handleFocusChange = (focusedInput) => setFocusedInput(focusedInput);
  const { locale } = intl;
  const language = intl.locale.split('-')[0] !== 'en';
  const classes = useStyles();
  useEffect(() => {
    moment.locale(locale);
  }, [locale]);
  const earliestEndDate = () => {
    if(disableEnd?.disableBefore.type === 'noValue' && disableStart?.disableBefore.type !== 'noValue') {
      return beforeDay(disableStart.disableBefore);
    }
    else if(disableEnd?.disableBefore.type !== 'noValue' && disableStart?.disableBefore.type === 'noValue') {
      return beforeDay(disableEnd.disableBefore);
    }
    else if(beforeDay(disableStart.disableBefore) > beforeDay(disableEnd.disableBefore)) {
      return beforeDay(disableStart.disableBefore);
    } else {
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

  const ariaLabel = getAriaLabel(
    uiSchema?.['ui:options']?.element?.label,
    uiSchema?.['ui:options'],
    required,
    intl.formatMessage({defaultMessage: 'Pakollinen kenttä'})
  );

  return (
    <div className={classes.dateBox} aria-labelledby={utils.ariaDescribedBy(idSchema.$id, uiSchema, rawErrors)}>
      <DateRangePicker
        onDatesChange={({ startDate, endDate }) => (startDate || endDate) && onChange({ start: startDate?.format('YYYY-MM-DD'), end: endDate?.format('YYYY-MM-DD')})}
        onFocusChange={handleFocusChange}
        focusedInput={focusedInput}
        small={true}
        numberOfMonths={1}
        aria-label={ariaLabel}
        screenReaderInputMessage={ariaLabel}
        displayFormat={dateFormat ?? 'D.M.yyyy'}
        disabled={schema.readOnly || uiSchema.readonly}
        {...language ? {phrases : mapValues(DateRangePickerPhrases, message => intl.formatMessage(message))} : {}}
        hideKeyboardShortcutsPanel
        startDate={formData?.start === undefined ? null : moment(formData?.start)}
        startDateId={idSchema.start.$id}
        startDatePlaceholderText={intl.formatMessage({
        defaultMessage: 'Alkupäivä',
        })}
        endDate={formData?.end === undefined ? null : moment(formData?.end)}
        endDateId={idSchema.end.$id}
        endDatePlaceholderText={intl.formatMessage({
          defaultMessage: 'Loppupäivä',
        })}
        isOutsideRange={(m) => focusedInput === 'startDate' ?
          (disableStart?.disableBefore.type !== 'noValue' &&
            m.isBefore(beforeDay(disableStart.disableBefore), 'day')) ||
          (disableStart?.disableAfter.type !== 'noValue' &&
            m.isAfter(afterDay(disableStart.disableAfter), 'day')) :
          ((disableEnd?.disableBefore.type !== 'noValue' || disableStart?.disableBefore.type !== 'noValue')  &&
            m.isBefore(earliestEndDate(), 'day')) ||
          (disableEnd?.disableAfter.type !== 'noValue' &&
            m.isAfter(afterDay(disableEnd.disableAfter), 'day'))
        }
      />
          {(formData?.start || formData?.end) ?
        <Button
          variant="contained"
          color="secondary"
          size={"small"}
          className={classes.button}
          onClick={(value) => value && onChange({ start: undefined, end: undefined})}
        >
          <FormattedMessage defaultMessage="Tyhjennä" />
        </Button>
          : <></>}
    </div>
  );
}

export default ({ config: { disableBefore, disableAfter, required, list }, reviewProps }) => ({
  schema: {
    type: 'object',
    ...(required ? { required: ['start', 'end']} : undefined),
    ...(list ? {default: {}} : undefined),
    properties: {
      start: {
        format: 'date',
        type: 'string',
      },
      end: {
        format: 'date',
        type: 'string',
      }
    },
  },
  uiSchema: {
    'ui:field': DateRangePickerField,
    'ui:options': {
      disableBefore,
      disableAfter,
      dateFormat: reviewProps?.dateFormat?.replaceAll('d', 'D')
    },
  },
});

export const name = defineMessage({
  defaultMessage: 'Päivämäärähaarukka',
});

export const elementType = 'field';

