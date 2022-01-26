import { forwardRef } from 'react';
import { IntlProvider, useIntl } from 'react-intl';
import enUS from '../.compiled-lang/en-US.json';
import fiFI from '../.compiled-lang/fi-FI.json';
import svSE from '../.compiled-lang/sv-SE.json';
import { Form, Formula } from './Formula';

const messages = {
  'en-US': enUS,
  'fi-FI': fiFI,
  'sv-SE': svSE,
};

function withMessages(Form) {
  return forwardRef((props, ref) => {
    const intl = useIntl();

    return (
      <IntlProvider
        {...intl}
        messages={{
          ...messages[intl.defaultLocale],
          ...messages[intl.locale],
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
