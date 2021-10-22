import { createContext, forwardRef, useContext, useMemo, useRef } from 'react';
import invariant from 'tiny-invariant';
import { clientPromise } from './client';

const Context = createContext();

export function FormulaProvider({ axios, children, dateFnsLocale }) {
  const contextRef = useRef({});

  if (axios) {
    (async function () {
      axios(await clientPromise);
    })();
  }

  return (
    <Context.Provider
      value={useMemo(
        () => ({ ...contextRef.current, dateFnsLocale }),
        [dateFnsLocale]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export const withFormulaProvider = (Form) =>
  forwardRef(({ axios, dateFnsLocale, ...other }, ref) => (
    <FormulaProvider axios={axios} dateFnsLocale={dateFnsLocale}>
      <Form ref={ref} {...other} />
    </FormulaProvider>
  ));

export function useFormulaContext() {
  const context = useContext(Context);
  invariant(
    context,
    'You should not use Formula hooks outside a <FormulaProvider>'
  );

  return context;
}
