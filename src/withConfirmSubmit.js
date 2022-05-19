import { forwardRef, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutations } from './api';
import ConfirmDialog from './ConfirmDialog';
import { hasConfirm } from './customizations';
import { chain } from './utils';

export default function withConfirmSubmit(Form) {
  return forwardRef(
    (
      {
        formMetaData,
        onPreSubmit,
        onPostSubmit,
        formDataAction,
        credentials,
        ...otherProps
      },
      ref
    ) => {
      const { submit } = useMutations();
      const { config, onSubmit = submit } = otherProps;
      const confirmDialogRef = useRef();

      const hasConfirmValue = hasConfirm(otherProps);

      return (
        <>
          {hasConfirmValue && (
            <ConfirmDialog
              title={<FormattedMessage defaultMessage="Lähetetäänkö lomake?" />}
              ref={confirmDialogRef}
              {...otherProps}
            ></ConfirmDialog>
          )}
          <Form
            ref={ref}
            {...otherProps}
            onSubmit={chain([
              onPreSubmit,
              hasConfirmValue &&
                ((...args) => confirmDialogRef.current.confirm(...args)),
              hasConfirmValue &&
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
                  _id: otherProps.dataId,
                };
                try {
                  const response = await onSubmit(
                    data,
                    credentials,
                    formDataAction,
                    ...args
                  );

                  if (hasConfirmValue) {
                    confirmDialogRef.current.close();
                  }

                  onPostSubmit?.(response, data, ...args);
                } catch (e) {
                  console.error(e);
                  if (hasConfirmValue) {
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
