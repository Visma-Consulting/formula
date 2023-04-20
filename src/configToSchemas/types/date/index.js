import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker, fiFI, svSE } from '@mui/x-date-pickers';
import { defineMessage, FormattedMessage, useIntl } from 'react-intl';
import dayjs from 'dayjs';
import "dayjs/locale/fi";
import "dayjs/locale/en-gb";
import "dayjs/locale/sv";
import { add, sub } from 'date-fns';
import { getAriaLabel } from '../../../utils';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  dateBox: {
    display: 'flex',
    alignItems: 'center',
  }
}));

function BasicDatePicker(props) {
  const { onChange, options } = props;
  const [value, setValue] = React.useState(null);
  const intl = useIntl();
  const { locale } = intl;
  const { disableBefore, disableAfter } = options?.element;
  const classes = useStyles();

  const beforeDay = () => {
    if(disableBefore?.type && disableBefore?.type !== 'noValue') {
      return dayjs((disableBefore.type !== 'date' ? sub(new Date(), { [disableBefore.type]: disableBefore.numberValue }) : disableBefore.dateValue));
    } else {
      return null;
    }
  }

  const afterDay = () => {
    if(disableAfter?.type && disableAfter?.type !== 'noValue') {
      return dayjs((disableAfter.type !== 'date' ? add(new Date(), { [disableAfter.type]: disableAfter.numberValue }) : disableAfter.dateValue));
    } else {
      return null;
    }
  }

  const ariaLabel = getAriaLabel(
    props.label,
    props.options,
    props.required,
    intl.formatMessage({defaultMessage: 'Pakollinen kenttä'})
  );

  const handleLocaleText = () => {
    if(locale === 'fi-FI') {
      return fiFI?.components?.MuiLocalizationProvider?.defaultProps?.localeText;
    } else if(locale === 'sv-SE') {
      return svSE?.components?.MuiLocalizationProvider?.defaultProps?.localeText;
    }
  }

  function onDateChange(value) {
    onChange(value?.format('YYYY-MM-DD'))
    setValue(value)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale.split('-')[0].toString()} localeText={handleLocaleText()} >
      <div className={classes.dateBox}>
        <DatePicker
          value={value}
          label={intl.formatMessage({defaultMessage: "Päivämäärä"})}
          minDate={beforeDay()}
          maxDate={afterDay()}
          sx={{
            maxWidth: 200,
            "& .MuiInputBase-input.Mui-disabled": {
              WebkitTextFillColor: "#000000",
            },
          }}
          arialabel={ariaLabel}
          format={'DD.MM.YYYY'}
          onChange={(newValue) => onDateChange(newValue)}
          slotProps={{
            textField: {
              disabled: true
            }
          }}
        />
        {value ?
          <Button
            variant="contained"
            color="secondary"
            size={"small"}
            className={classes.button}
            onClick={(value) => value && props.list ? onChange([null]) : value && onDateChange(null)}
          >
            <FormattedMessage defaultMessage="Tyhjennä" />
          </Button>
          : <></>}
      </div>
    </LocalizationProvider>
  );
}

export default ({ config: { disableBefore, disableAfter } }) => ({
  schema: {
    format: 'date',
    type: 'string',
  },
  uiSchema: {
    'ui:widget': BasicDatePicker,
    'ui:options': {
      disableBefore,
      disableAfter,
    }
  }
})

export const name = defineMessage({
  defaultMessage: 'Päivämäärä',
});

export const elementType = 'field';
