import { useCallback, useState } from 'react';

const withLiveValidateOnError =
  (Form) =>
  ({ onError, ...props }) => {
    const [hasErrors, setHasErrors] = useState();

    const handleError = useCallback(
      (errors) => {
        setHasErrors(true);
        onError?.(errors);
      },
      [onError]
    );

    return <Form liveValidate={hasErrors} {...props} onError={handleError} />;
  };

export default withLiveValidateOnError;
