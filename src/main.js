import rjsf_enUS from '@visma/rjsf-core/dist/compiled-lang/en-US.json';
import rjsf_fiFI from '@visma/rjsf-core/dist/compiled-lang/fi-FI.json';
import rjsf_svSE from '@visma/rjsf-core/dist/compiled-lang/sv-SE.json';
import { forwardRef } from 'react';
import { IntlProvider, useIntl } from 'react-intl';
import formula_enUS from '../.compiled-lang/en-US.json';
import formula_fiFI from '../.compiled-lang/fi-FI.json';
import formula_svSE from '../.compiled-lang/sv-SE.json';
import { Form, Formula } from './Formula';

const formula_messages = {
  'en-US': formula_enUS,
  'fi-FI': formula_fiFI,
  'sv-SE': formula_svSE,
};

const rjsf_messages = {
  'en-US': rjsf_enUS,
  'fi-FI': rjsf_fiFI,
  'sv-SE': rjsf_svSE,
};

function withMessages(Form) {
  return forwardRef((props, ref) => {
    const intl = useIntl();

    return (
      <IntlProvider
        {...intl}
        messages={{
          ...rjsf_messages[intl.defaultLocale],
          ...rjsf_messages[intl.locale],
          ...formula_messages[intl.defaultLocale],
          ...formula_messages[intl.locale],
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
