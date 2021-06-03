import { createContext, forwardRef, useContext, useRef } from 'react';
import { create as createUseAxios } from 'use-axios';
import { create as createAxios } from 'axios';
import invariant from 'tiny-invariant';

const Context = createContext();

function create(config) {
  const axios = createAxios(config);

  return { axios, ...createUseAxios(axios) };
}

export function FormulaProvider({ axios, children }) {
  const contextRef = useRef();
  if (!contextRef.current) {
    contextRef.current = create();
  }

  if (axios) {
    axios(contextRef.current.axios);
  }

  return (
    <Context.Provider value={contextRef.current}>{children}</Context.Provider>
  );
}

export const withFormulaProvider = (Component) =>
  forwardRef(({ axios, ...other }, ref) => (
    <FormulaProvider axios={axios}>
      <Component ref={ref} {...other} />
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
