import { createContext, forwardRef, useContext, useMemo, useRef } from 'react';
import invariant from 'tiny-invariant';
import { clientPromise } from './client';

const Context = createContext();

export function FormulaProvider({ axios, children, dateFnsLocale }) {
  const contextRef = useRef();
  if (!contextRef.current) {
    contextRef.current = {};
  }

  if (axios) {
    (async function () {
      axios(await clientPromise);
    })();
  }

  return (
    <Context.Provider
      value={useMemo(
        () => ({ ...contextRef.current, dateFnsLocale }),
        [contextRef.current, dateFnsLocale]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export const withFormulaProvider = (Form) =>
  forwardRef(({ axios, ...other }, ref) => (
    <FormulaProvider axios={axios}>
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
