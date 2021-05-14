import { useIntl } from 'react-intl';

export default function useLocalize() {
  const { locale, defaultLocale } = useIntl();
  const [lang] = locale.split('-');
  const [defaultLang] = defaultLocale.split('-');

  return (messages = {}) => messages[lang] ?? messages[defaultLang] ?? '';
}
