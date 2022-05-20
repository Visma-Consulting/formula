import { SnackbarProvider, useSnackbar } from 'notistack';
import {forwardRef } from 'react';

export default function withSnackbar(Form) {
  return forwardRef((props, ref) => {
    const form = <Form ref={ref} {...props} />;

    return useSnackbar() ? form : <SnackbarProvider>{form}</SnackbarProvider>;
  });
}
