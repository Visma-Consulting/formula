import { forwardRef, useRef, useState } from 'react';
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
      const formRef = useRef();
      ref ??=formRef;
      const determineActiveStep = () => {
        const newUiSchema = Object.entries(formRef?.current?.props?.uiSchema)
          .filter(([key, value]) => value && value['ui:widget'] !== 'hidden');
        const pageTitles = formRef.current.props.uiSchema['ui:options'].element.elements.filter(x => x.type === 'pageTitle');
        const uiOptions = newUiSchema.pop()[1].element.elements;
        const index = uiOptions.findIndex(x => x.key === newUiSchema[0][0].toString());
        for (let i = index -1; i >= 0; i--) {
          if(uiOptions[i].type === 'pageTitle') {
            return pageTitles.findIndex(x => x.key === uiOptions[i].key);
          }
        }
      };

      const intl = useIntl();
      const { enqueueSnackbar } = useSnackbar();
      const multiPageForm = props?.config?.elements.find(element => element.type === 'pageTitle') ? true : false;
      const draftSave = async () => {
        const data = {
          status: 'DRAFT',
        ...multiPageForm &&
        { activeStep: determineActiveStep() },
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
