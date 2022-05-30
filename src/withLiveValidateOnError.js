import { useCallback, useState, forwardRef } from 'react';

function withLiveValidateOnError(Form) {
  return forwardRef(
    ({ onError, ...props }, ref) => {
      const [hasErrors, setHasErrors] = useState();

      const handleError = useCallback(
        (errors) => {
          setHasErrors(true);
          onError?.(errors);
        },
        [onError]
      );

      return <Form ref={ref} liveValidate={hasErrors} {...props} onError={handleError} />;
    }
  )
}

export default withLiveValidateOnError;
