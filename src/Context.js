import { createContext, forwardRef, useContext, useMemo, useRef } from 'react';
import { create as createUseAxios } from 'use-axios';
import { create as createAxios } from 'axios';
import invariant from 'tiny-invariant';

const Context = createContext();

function create() {
  const axios = createAxios();

  return { axios, ...createUseAxios(axios) };
}

export function FormulaProvider({ axios, children, dateFnsLocale }) {
  const contextRef = useRef();
  if (!contextRef.current) {
    contextRef.current = create();
  }

  if (axios) {
    axios(contextRef.current.axios);
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
