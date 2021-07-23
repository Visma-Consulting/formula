import { forwardRef, useRef } from 'react';

import ConfirmDialog from './ConfirmDialog';
import { FormattedMessage } from 'react-intl';
import invariant from 'tiny-invariant';

export default function withConfirmSubmit(Form) {
  return forwardRef(({ confirm = true, ...other }, ref) => {
    const confirmDialogRef = useRef();

    invariant(
      !(confirm && other.onPreSubmit),
      'You should not use prop `confirm` with `onPreSubmit`'
    );

    return (
      <>
        {confirm && (
          <ConfirmDialog
            title={<FormattedMessage defaultMessage="Lähetetäänkö lomake?" />}
            ref={confirmDialogRef}
            {...confirm}
          ></ConfirmDialog>
        )}
        <Form
          ref={ref}
          onPreSubmit={confirm && (() => confirmDialogRef.current.confirm())}
          {...other}
        />
      </>
    );
  });
}
