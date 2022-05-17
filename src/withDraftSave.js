import {forwardRef, useState} from 'react';
import {FormattedMessage} from "react-intl";
import Button from "@material-ui/core/Button";
import {useMutations} from './api';

export default function withDraftSave(Form) {

  return forwardRef(
    (props, ref) => {
      const [draftId, setDraftId] = useState(props.dataId && props.dataIsDraft ? props.dataId : null);
      const [isDraft, setIsDraft] = useState(props.dataIsDraft);

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
        const response = await onSave(data, props.credentials, props.formDataAction, isDraft);

        setDraftId(response.attributes?.id);
        setIsDraft(true);

        return false;
      };

      const isSubmittedData = props?.dataId && !props?.dataIsDraft;

      return (props?.config?.draftSave && !isSubmittedData ?
          <Form ref={ref}
                {...props}
                dataIsDraft={isDraft}
                dataId={draftId}
          >
            <Button
              onClick={() => draftSave()}
            >
              <FormattedMessage defaultMessage="Tallenna"/>
            </Button>
            {/*{props.children ? props.children : (<Button*/}
            {/*  type="submit"*/}
            {/*  variant="contained"*/}
            {/*  color="primary"*/}
            {/*>*/}
            {/*  <FormattedMessage defaultMessage="Lähetä" />*/}
            {/*</Button>)}*/}
          </Form> :
          <Form ref={ref} {...props} />
      );
    }
  );
}
