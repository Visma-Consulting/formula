import { forwardRef } from 'react';

export const forceBlur = (e) => {
  if (e?.target !== document.activeElement && document.activeElement) {
    document.activeElement.blur()
  }
}

export default function withOnTouch(Form) {
  return forwardRef(
    (props, ref) =>
      <div onTouchStart={forceBlur}>
        <Form ref={ref} {...props} />
      </div>
  );
}
