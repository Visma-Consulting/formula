import { forwardRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './ErrorFallback';

function withFormulaErrorBoundary(Form) {
  return forwardRef(
    ({ ...props }, ref) => {
      return (<ErrorBoundary FallbackComponent={ErrorFallback}>
        <Form ref={ref} {...props} />
      </ErrorBoundary>);
    }
  )
}

export default withFormulaErrorBoundary;
