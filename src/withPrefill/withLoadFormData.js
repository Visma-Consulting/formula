import { forwardRef } from 'react';

export default function withLoadFormData(Form) {
  return forwardRef(function WithLoadFormData(
    { useLoadFormData, ...otherProps },
    ref
  ) {
    return (
      <Form
        ref={ref}
        {...otherProps}
        formData={useLoadFormData?.(otherProps) ?? otherProps.formData}
      />
    );
  });
}
