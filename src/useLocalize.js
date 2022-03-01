import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { some } from 'lodash/collection';

export function useLocalize() {
  const { locale, defaultLocale } = useIntl();
  const [lang] = locale.split('-');
  const [defaultLang] = defaultLocale.split('-');

  const getSomeTranslation = (messages) => {
    if (!some(messages)) { return null }
    let someLang;
    Object.filter = (obj, predicate) =>
      Object.keys(obj)
        .filter( key => predicate(obj[key]) )
        .reduce( (res, key) => (res[key] = obj[key], res), {} );
    const newMessages = Object.filter(messages, value => value !== "");
    someLang = Object.getOwnPropertyNames(newMessages).toString();
    return someLang.length > 2 ? messages[someLang.slice(0,2)] : messages[someLang];
  }

  return useCallback(
    (messages = {}) => messages[lang] ?? messages[defaultLang] ?? getSomeTranslation(messages) ?? '',
    [defaultLang, lang]
  );
}
