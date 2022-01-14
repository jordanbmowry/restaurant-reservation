import React, { useContext } from 'react';
import Menu from './Menu';
import Routes from './Routes';
import clsx from 'clsx';
import { ThemeContext } from '../ThemeContext/ThemeContext';

import './Layout.css';

/**
 * Defines the main layout of the application.
 *
 * You will not need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Layout() {
  const { isDarkTheme } = useContext(ThemeContext);

  const classNames = clsx({
    dark: isDarkTheme,
  });
  return (
    <div className='container-fluid'>
      <div className='row h-100'>
        <div className={`col-md-2 side-bar ${classNames}`}>
          <Menu />
        </div>
        <div className='col'>
          <Routes />
        </div>
      </div>
    </div>
  );
}

export default Layout;
