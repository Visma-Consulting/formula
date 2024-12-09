import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { some } from 'lodash/collection';

const getAllowedLanguage = (lang, languages) => {
  // if allowed languages are not defined or empty, use lang
  if (languages === undefined || languages.length === 0) return lang;
  // if lang is not allowed language, return first language in the list
  else if (!languages.includes(lang)) return languages[0];
  else return lang;
}

export function useLocalize(languages) {
  const { locale, defaultLocale } = useIntl();
  const [lang] = getAllowedLanguage(locale, languages).split('-');
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
