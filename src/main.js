import rjsf_enUS from '@visma/rjsf-core/dist/compiled-lang/en-US.json';
import rjsf_fiFI from '@visma/rjsf-core/dist/compiled-lang/fi-FI.json';
import rjsf_svSE from '@visma/rjsf-core/dist/compiled-lang/sv-SE.json';
import { forwardRef } from 'react';
import { IntlProvider, useIntl } from 'react-intl';
import formula_enUS from '../.compiled-lang/en-US.json';
import formula_fiFI from '../.compiled-lang/fi-FI.json';
import formula_svSE from '../.compiled-lang/sv-SE.json';
import { Form, Formula } from './Formula';

const messages = {
  'en-US': { ...formula_enUS, ...rjsf_enUS },
  'fi-FI': { ...formula_fiFI, ...rjsf_fiFI },
  'sv-SE': { ...formula_svSE, ...rjsf_svSE },
};

const defaultLocale = 'fi-FI';

const availableLocales = Object.fromEntries(
  Object.keys(messages).flatMap((locale) => [
    [locale, locale],
    [locale.split('-')[0], locale],
  ])
);

function withMessages(Form) {
  return forwardRef((props, ref) => {
    const intl = useIntl();
    const locale = availableLocales[intl.locale] ?? defaultLocale;

    return (
      <IntlProvider
        {...intl}
        locale={locale}
        messages={{
          ...messages[defaultLocale],
          ...messages[locale],
          ...intl.messages,
        }}
      >
        <Form ref={ref} {...props} />
      </IntlProvider>
    );
  });
}

const FormWithMessages = withMessages(Form);
const FormulaWithMessages = withMessages(Formula);

export * from '.';
export {
  FormulaWithMessages as Formula,
  FormWithMessages as Form,
  FormulaWithMessages as default,
};
