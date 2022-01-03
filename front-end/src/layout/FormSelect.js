import React from 'react';

export default function FormSelect(props) {
  const { children, label, id, name, ...rest } = props;

  return (
    <div className='col-auto'>
      <div className='form-group form-row'>
        <label htmlFor={id}>{label}</label>
        <select name={name} className='form-select' id={id} {...rest}>
          {children}
        </select>
      </div>
    </div>
  );
}
