import React from 'react';
import clsx from 'clsx';

export default function Button(props) {
  const {
    children,
    btnPrimary,
    btnSecondary,
    btnSuccess,
    btnDanger,
    className,
    btnWarning,
    btnInfo,
    btnLight,
    btnDark,
    btnLink,
    ...rest
  } = props;

  const classNames = clsx(
    {
      btn: true,
      'btn-primary': btnPrimary,
      'btn-secondary': btnSecondary,
      'btn-success': btnSuccess,
      'btn-danger': btnDanger,
      'btn-warning': btnWarning,
      'btn-info': btnInfo,
      'btn-light': btnLight,
      'btn-dark': btnDark,
      'btn-link': btnLink,
    },
    className
  );

  return (
    <button className={classNames} {...rest}>
      {children}
    </button>
  );
}
