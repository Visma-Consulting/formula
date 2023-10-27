import { forwardRef, useRef } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Button from "@material-ui/core/Button";
import { useMutations } from './api';
import ConfirmDialog from './ConfirmDialog';
import { hasConfirm, hasPreview } from './customizations';
import { chain } from './utils';
import { makeStyles } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  noPrint: {
    '& > *': {
      '@media print': {
        display: 'none',
      },
    },
  }
}));

export default function withConfirmSubmit(Form) {
  return forwardRef(
    (
      {
        formMetaData,
        onPreSubmit,
        onPostSubmit,
        formDataAction,
        credentials,
        credentialsCallback,
        dataIsDraft,
        customMessages,
        layer,
        ...otherProps
      },
      ref
    ) => {
      const { submit } = useMutations();
      const { config, onSubmit = submit } = otherProps;
      const { meta } = config;
      const confirmDialogRef = useRef();
      const containerRef = useRef();
      const classes = useStyles();
      const intl = useIntl();
      const { locale } = intl
      const hasConfirmValue = hasConfirm(otherProps);
      const dialogTitle = customMessages?.confirmDialogTitle ??
        (meta?.preview ? <FormattedMessage defaultMessage="Tarkista ja lähetä lomake" />
          : meta?.consent ? <FormattedMessage defaultMessage="Vahvista ja lähetä lomake" />
            : <FormattedMessage defaultMessage="Lähetä lomake" />);
      return (
        <>
          {hasConfirmValue && (
            <>
              <div ref={containerRef} />
              <ConfirmDialog
                title={dialogTitle}
                ref={confirmDialogRef}
                customMessages={customMessages}
                container={containerRef.current}
                {...otherProps}
              />
            </>
          )}
          <div {...useMediaQuery('print') && hasPreview(otherProps) ? {className: classes.noPrint} : {}}>
            <Form
              ref={ref}
              credentials={credentials}
              formDataAction={formDataAction}
              dataIsDraft={dataIsDraft}
              customMessages={customMessages}
              layer={layer}
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
                      lang: locale.split('-')[0],
                    },
                    ...formMetaData,
                    values: formData,
                    captchaChallenge,
                    _id: otherProps.dataId
                  };
                  try {
                    const callbackCredentials = credentialsCallback ? await credentialsCallback() : credentials;
                    const response = await onSubmit(
                      data,
                      callbackCredentials,
                      formDataAction,
                      dataIsDraft,
                      layer,
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
                    {customMessages?.submit ?? <FormattedMessage defaultMessage="Lähetä" />}
                  </Button>
                </div>}
            </Form>
          </div>
        </>
      );
    }
  );
}
