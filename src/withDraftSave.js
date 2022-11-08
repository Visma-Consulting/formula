import {forwardRef, useState} from 'react';
import {FormattedMessage, useIntl} from "react-intl";
import Button from "@material-ui/core/Button";
import {useMutations} from './api';
import { useSnackbar } from 'notistack';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(1),
  },
}));

export default function withDraftSave(Form) {

  return forwardRef(
    (props, ref) => {
      const classes = useStyles();
      const [draftId, setDraftId] = useState(props.dataId && props.dataIsDraft ? props.dataId : null);
      const [isDraft, setIsDraft] = useState(props.dataIsDraft);

      const intl = useIntl();
      const { enqueueSnackbar } = useSnackbar();

      const draftSave = async () => {
        const data = {
          status: 'DRAFT',
          form: {
            id: props?.config?._id,
            rev: props?.config?._rev,
          },
          values: props?.formData,
          _id: draftId,
        };

        let onSave = props.onDraftSave;
        const { submit } = useMutations();
        onSave ??= submit;

        let preResult = true;
        if (props.preDraftSave) {
          preResult = props.preDraftSave();
        }

        if (!preResult) {
          return false;
        }

        const response = await onSave(data, props.credentials, props.formDataAction, isDraft);

        if (response) {
          enqueueSnackbar(
            intl.formatMessage({
              defaultMessage: 'Tallennettu',
            }),
            {
              variant: 'success',
            }
          );

          setDraftId(response.attributes?.id);
          setIsDraft(true);

          if (props.afterDraftSave) {
            props.afterDraftSave(response);
          }
        }

        return false;
      };

      const isSubmittedData = props?.dataId && !props?.dataIsDraft;

      const draftButton = (<Button
        onClick={() => draftSave()}
        className={classes.button}
      >
        <FormattedMessage defaultMessage="Tallenna"/>
      </Button>);

      return (props?.config?.draftSave && !isSubmittedData ?
          <Form ref={ref}
                {...props}
                dataIsDraft={isDraft}
                dataId={draftId}
                draftButton={props.draftButton ? props.draftButton : draftButton}
          /> :
          <Form ref={ref} {...props} />);
    }
  );
}
