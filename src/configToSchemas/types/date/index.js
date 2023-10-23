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
import { getAriaLabel, ariaDescribedBy } from '../../../utils';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect } from 'react';
import { utils } from '@visma/rjsf-core';
import { useMediaQuery } from '@material-ui/core';

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
    },
  }
}));

const getDefaultValue = ({type, defaultValue, limitType, limitAmount}) => {
  switch (type) {
    case 'noDefault': return null;
    case 'today': return dayjs();
    case 'fixed': return dayjs(defaultValue);
    case 'limit': return limitAmount < 0
      ? beforeDay({type: limitType, numberValue: limitAmount * -1 })
      : afterDay({type: limitType, numberValue: limitAmount });
  }
  return null;
}

const beforeDay = (disableBefore) => {
  if(disableBefore?.type && disableBefore?.type !== 'noValue') {
    return dayjs((disableBefore.type !== 'date' ? sub(new Date(), { [disableBefore.type]: disableBefore.numberValue }) : disableBefore.dateValue));
  } else {
    return null;
  }
}

const afterDay = (disableAfter) => {
  if(disableAfter?.type && disableAfter?.type !== 'noValue') {
    return dayjs((disableAfter.type !== 'date' ? add(new Date(), { [disableAfter.type]: disableAfter.numberValue }) : disableAfter.dateValue));
  } else {
    return null;
  }
}

function BasicDatePicker(props) {
  const { onChange, options } = props;
  const [value, setValue] = React.useState(null);
  const intl = useIntl();
  const { locale } = intl;
  const { disableBefore, disableAfter } = options?.element;
  const classes = useStyles();
  const isDesktop = useMediaQuery('@media (pointer: fine)');
  const ariaLabel = getAriaLabel(
    props.label,
    props.options,
    props.required,
    intl.formatMessage({defaultMessage: 'Pakollinen kenttä'})
  );
  const ariaDaySelected = intl.formatMessage({defaultMessage: 'Valitse päivä, valittu päivä on'});
  const ariaNoSelection = intl.formatMessage({defaultMessage: 'Valitse päivä'});
  const ariaToUse = value ? `${ariaDaySelected} ${value?.format('YYYY-MM-DD')}` : ariaNoSelection;
  const handleLocaleText = () => {
    if(locale === 'fi-FI') {
      return fiFI?.components?.MuiLocalizationProvider?.defaultProps?.localeText;
    } else if(locale === 'sv-SE') {
      return svSE?.components?.MuiLocalizationProvider?.defaultProps?.localeText;
    }
  }

  useEffect(() =>{
    setValue(props?.value ? dayjs(props?.value) : (options.dateDefault ? getDefaultValue(options.dateDefault) : null));
  }, []);

  useEffect(() => {
    setTimeout(() => { onChange(value?.format('YYYY-MM-DD')) })
  }, [value]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale.split('-')[0].toString()} localeText={handleLocaleText()} >
      <div className={classes.dateBox}>
        <DatePicker
          {...options?.dateDefault ? {defaultValue: getDefaultValue(options.dateDefault)} : {}}
          value={value}
          label={intl.formatMessage({defaultMessage: "Päivämäärä"})}
          minDate={beforeDay(disableBefore)}
          maxDate={afterDay(disableAfter)}
          sx={{
            maxWidth: 200,
            "& .MuiInputBase-input.Mui-disabled": {
              WebkitTextFillColor: "#000000",
            },
          }}
          arialabel={ariaLabel}
          format={props?.options?.dateFormat ?? 'D.M.YYYY'}
          onChange={setValue}
          slotProps={{
            textField: {
              disabled: isDesktop,
              placeholder: '',
              'aria-describedby': utils.ariaDescribedBy(props.id, props.uiSchema, props.rawErrors)
            },
            openPickerButton: {
              'aria-label': `${ariaLabel}, ${ariaToUse}`,
              'aria-describedby': utils.ariaDescribedBy(props.id, props.uiSchema, props.rawErrors)
            }
          }}
        />
        {value ?
          <Button
            variant="contained"
            color="secondary"
            size={"small"}
            className={classes.button}
            onClick={(value) => value && props.list ? onChange([null]) : value && setValue(null)}
          >
            <FormattedMessage defaultMessage="Tyhjennä" />
          </Button>
          : <></>}
      </div>
    </LocalizationProvider>
  );
}

export default ({ config: { disableBefore, disableAfter, dateDefault }, reviewProps }) => ({
  schema: {
    format: 'date',
    type: 'string',
  },
  uiSchema: {
    'ui:widget': BasicDatePicker,
    'ui:options': {
      disableBefore,
      disableAfter,
      dateDefault,
      dateFormat: reviewProps?.dateFormat?.replaceAll('d', 'D')
    }
  }
})

export const name = defineMessage({
  defaultMessage: 'Päivämäärä',
});

export const elementType = 'field';
