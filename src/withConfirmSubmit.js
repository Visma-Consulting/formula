import { forwardRef, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import Button from "@material-ui/core/Button";
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
        dataIsDraft,
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
            credentials={credentials}
            formDataAction={formDataAction}
            dataIsDraft={dataIsDraft}
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
                    dataIsDraft,
                    ...args
                  );

                  if (hasConfirmValue) {
                    confirmDialogRef.current.close();
                  }

                  onPostSubmit?.(response, data, ...args);
                } catch (e) {
                  console.error(e);
                  if (hasConfirmValue) {
                    confirmDialogRef.current.error(e.response?.data);
                  }
                }
              },
            ])}
          >
            {otherProps.children ? otherProps.children :
              <div>
                {otherProps.draftButton}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  <FormattedMessage defaultMessage="Lähetä" />
                </Button>
                </div>}
          </Form>
        </>
      );
    }
  );
}
