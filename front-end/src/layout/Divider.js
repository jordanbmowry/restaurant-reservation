import React, { useContext } from 'react';
import clsx from 'clsx';
import { ThemeContext } from '../ThemeContext/ThemeContext';

export default function Divider() {
  const { isDarkTheme } = useContext(ThemeContext);

  const classNames = clsx({
    dark: isDarkTheme,
  });

  return <div className={`w-100 p-2 divider my-4 ${classNames}`}></div>;
}
