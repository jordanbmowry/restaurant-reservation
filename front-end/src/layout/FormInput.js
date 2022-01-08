import React from 'react';

export default function FormInput(props) {
  const { children, type = 'text', label, id, ...rest } = props;

  return (
    <div className='col-auto'>
      <div className='form-group form-row'>
        <label htmlFor={id}>{label}</label>
        <input className='form-control' id={id} type={type} {...rest} />
        {children}
      </div>
    </div>
  );
}
