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
import { defineMessage, FormattedMessage, useIntl } from 'react-intl';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { mapValues } from 'lodash';
import { DateRangePickerPhrases } from '../../../../lib/configToSchemas/types/date/phrases';

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
}));
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

function SingleDatePickerWidget({ id, onChange, options, schema, value }) {
  const intl = useIntl();
  const language = intl.locale.split('-')[0] !== 'en';
  const [focused, setFocused] = useState();
  const { title, label, useLabel, list } = options.element;
  const handleFocusChange = ({ focused }) => setFocused(focused);
  const { locale } = intl;
  const classes = useStyles();
  useEffect(() => {
    moment.locale(locale);
  }, [locale]);

  return (
    <div>
      <SingleDatePicker
        date={value === undefined ? null : moment(value)}
        onDateChange={(date) => date && onChange(date.format('YYYY-MM-DD'))}
        focused={focused}
        {...language ? {phrases : mapValues(DateRangePickerPhrases, message => intl.formatMessage(message))} : {}}
        ariaLabel={useLabel ? label : title}
        screenReaderInputMessage={<FormattedMessage defaultMessage={'Päivämäärä'}/> }
        onFocusChange={handleFocusChange}
        id={id}
        disabled={schema.readOnly || options.readonly}
        placeholder={useLabel ? label : title}
        hideKeyboardShortcutsPanel
        isOutsideRange={(m) =>
          (options.disableBefore && options.element.disableBefore.type &&
            m.isBefore(beforeDay(options.element.disableBefore), 'day') && options.element.disableBefore.type !== 'noValue') ||
          (options.disableAfter && options.element.disableAfter.type &&
            m.isAfter(afterDay(options.element.disableAfter), 'day') && options.element.disableAfter.type !== 'noValue')
        }
      />
      {value !== undefined ?
      <Button
        variant="contained"
        color="secondary"
        className={classes.button}
        onClick={(value) => value && list ? onChange([undefined]) : value && onChange(undefined)}
      >
        <FormattedMessage defaultMessage="Tyhjennä" />
      </Button>
      : <></>}
    </div>
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
