import React from 'react';

export default function Form(props) {
  const { children, handleSubmit, className } = props;

  return (
    <div className={`row ${className}`}>
      <form onSubmit={handleSubmit}>{children}</form>
    </div>
  );
}
