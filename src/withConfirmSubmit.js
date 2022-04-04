import { forwardRef, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutations } from './api';
import ConfirmDialog, { isCaptchaRequired } from './ConfirmDialog';
import { chain } from './utils';

export default function withConfirmSubmit(Form) {
  return forwardRef(
    (
      {
        confirm = true,
        formMetaData,
        onPreSubmit,
        onSubmit,
        onPostSubmit,
        formDataAction,
        credentials,
        ...other
      },
      ref
    ) => {
      const { config } = other;
      const confirmDialogRef = useRef();

      const { submit } = useMutations();

      onSubmit ??= submit;

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
            onSubmit={chain([
              onPreSubmit,
              showConfirm &&
              ((...args) => confirmDialogRef.current.confirm(...args)),
              showConfirm &&
              ((...args) => {
                confirmDialogRef.current.loading();
                return args;
              }),
              async (...args) => {
                const [{ captchaChallenge, formData }] = args;
                const data = {
                  status: 'SUBMITTED',
                  form: {
                    id: config._id,
                    rev: config._rev,
                  },
                  ...formMetaData,
                  values: formData,
                  captchaChallenge,
                  _id: other.dataId,
                };
                try {
                  const response = await onSubmit(data, credentials, formDataAction, ...args);

                  if (showConfirm) {
                    confirmDialogRef.current.close();
                  }

                  onPostSubmit?.(response, data, ...args);
                } catch (e) {
                  console.error(e);
                  if (showConfirm) {
                    confirmDialogRef.current.error();
                  }
                }
              },
            ])}
          />
        </>
      );
    }
  );
}
