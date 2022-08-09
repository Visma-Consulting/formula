import { makeStyles } from '@mui/material';
import Link from '@mui/material/Link';
import displayNames from '@visma/react-app-locale-utils/lib/displayNames';
import useLocale from '@visma/react-app-locale-utils/lib/useLocale';

const useStyles = makeStyles((theme) => ({
  link: {
    marginRight: theme.spacing(0.5),
  },
}));

export default function LocaleSwitcher() {
  const [locale, setLocale] = useLocale();
  const classes = useStyles();

  return displayNames.map((displayName) => (
    <Link
      component="button"
      key={displayName.locale}
      selected={locale === displayName.locale}
      onClick={() => {
        setLocale(displayName.locale);
      }}
      className={classes.link}
    >
      {displayName.value}
    </Link>
  ));
}
