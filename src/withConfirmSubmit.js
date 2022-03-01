import { forwardRef, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import ConfirmDialog, { isCaptchaRequired } from './ConfirmDialog';
import { chain } from './utils';

export default function withConfirmSubmit(Form) {
  return forwardRef(({ confirm = true, onPreSubmit, onPostSubmit, ...other }, ref) => {
    const confirmDialogRef = useRef();

    const showConfirm = confirm || isCaptchaRequired(other.config);

    return (
      <>
        {showConfirm && (
          <ConfirmDialog
            title={<FormattedMessage defaultMessage="Lähetetäänkö lomake?" />}
            ref={confirmDialogRef}
            {...other}
          ></ConfirmDialog>
        )}
        <Form
          ref={ref}
          {...other}
          onPreSubmit={chain([
            onPreSubmit,
            showConfirm &&
              ((...args) => confirmDialogRef.current.confirm(...args)),
            showConfirm &&
              ((...args) => {
                confirmDialogRef.current.loading();
                return args;
              })
          ])}
          onPostSubmit={chain([
            showConfirm && ((...args) => {
              confirmDialogRef.current.close();
              return args;
            }),
            onPostSubmit
          ])}
        />
      </>
    );
  });
}
