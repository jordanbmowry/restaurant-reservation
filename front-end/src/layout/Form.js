import React from 'react';

export default function Form(props) {
  const { children, handleSubmit } = props;

  return (
    <div className='row'>
      <form onSubmit={handleSubmit}>{children}</form>
    </div>
  );
}
