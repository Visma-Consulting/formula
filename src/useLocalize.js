import { useCallback } from 'react';
import { useIntl } from 'react-intl';

export function useLocalize() {
  const { locale, defaultLocale } = useIntl();
  const [lang] = locale.split('-');
  const [defaultLang] = defaultLocale.split('-');

  return useCallback(
    (messages = {}) => messages[lang] ?? messages[defaultLang] ?? '',
    [defaultLang, lang]
  );
}
