import { forwardRef, useState } from 'react';
import Review from './Review';

export default function withReview(Form) {
  const ReviewAfterSubmit = forwardRef(
    ({ review, onPostSubmit, ...other }, ref) => {
      const [submittedFormData, setSubmittedFormData] = useState();

      return submittedFormData !== undefined ? (
        <Review {...other} formData={submittedFormData} />
      ) : (
        <Form
          ref={ref}
          onPostSubmit={async (...args) => {
            const response = await onPostSubmit?.(...args);
            const [, , { formData }] = args;
            setSubmittedFormData(formData);
            return response;
          }}
          {...other}
        />
      );
    }
  );

  return forwardRef(({ review = true, forceReview = false, ...other }, ref) => {
    if (forceReview) {
      return <Review ref={ref} {...other} />;
    }

    if (review) {
      return <ReviewAfterSubmit ref={ref} {...other} />;
    }

    return <Form ref={ref} {...other} />;
  });
}
