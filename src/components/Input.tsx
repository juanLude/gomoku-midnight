import React from "react";

const Input = React.forwardRef(
  (
    props: React.InputHTMLAttributes<HTMLInputElement>,
    ref?: React.ForwardedRef<HTMLInputElement>
  ) => {
    return <input ref={ref} type="text" autoComplete="false" {...props} />;
  }
);

export default Input;
