import { forwardRef, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import invariant from 'tiny-invariant';
import ConfirmDialog, { isCaptchaRequired } from './ConfirmDialog';

export default function withConfirmSubmit(Form) {
  return forwardRef(({ confirm = true, ...other }, ref) => {
    const confirmDialogRef = useRef();

    invariant(
      !(confirm && other.onPreSubmit),
      'You should not use prop `confirm` with `onPreSubmit`'
    );

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
          onPreSubmit={
            showConfirm &&
            ((...args) => confirmDialogRef.current.confirm(...args))
          }
          {...other}
        />
      </>
    );
  });
}
