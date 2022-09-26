import { forwardRef, useRef } from 'react';

export default function withScrollToError(Form) {
  return forwardRef((props, ref) => {
    const {onError, ...otherProps} = props;
    const formWrapperRef = useRef();

    const scrollOnError = (...args) => {
      //const errorListElement = document.getElementById('formula-validation-errors');
      const errorListElement = formWrapperRef.current?.querySelector('#' + 'formula-validation-errors');
      errorListElement?.focus();
      errorListElement?.scrollIntoView({behavior: 'smooth'});
      onError?.(...args);
    }

    return <div ref={formWrapperRef}><Form ref={ref} onError={scrollOnError} {...otherProps} /></div>
  })
}
