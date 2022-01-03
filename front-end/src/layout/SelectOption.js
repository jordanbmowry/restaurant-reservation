import React from 'react';

export default function SelectOption(props) {
  const { children, value, ...rest } = props;

  return (
    <option value={value} {...rest}>
      {children}
    </option>
  );
}
