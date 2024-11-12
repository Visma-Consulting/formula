import { forwardRef } from 'react';

export default function withOnTouch(Form) {
  return forwardRef(
    (props, ref) =>
      <div onTouchStart={e => {
        if (e.target !== document.activeElement && document.activeElement) {
          document.activeElement.blur()
        }
      }}>
        <Form ref={ref} {...props} />
      </div>
  );
}
