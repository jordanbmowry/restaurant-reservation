import React from 'react';

import { Link, NavLink } from 'react-router-dom';

/**
 * Defines the menu for this application.
 *
 * @returns {JSX.Element}
 */

function Menu() {
  return (
    <nav className='navbar navbar-dark align-items-start p-0'>
      <div className='container-fluid d-flex flex-column p-0'>
        <Link
          className='navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0'
          to='/'
        >
          <div className='sidebar-brand-text mx-3'>
            <span>Restaurant Reservation System</span>
          </div>
        </Link>
        <hr className='sidebar-divider my-0' />
        <ul className='nav navbar-nav text-light' id='accordionSidebar'>
          <li className='nav-item'>
            <NavLink
              activeClassName='active'
              className='nav-link'
              to='/dashboard'
            >
              {' '}
              <i className='fas fa-home'></i>
              &nbsp;Dashboard
            </NavLink>
          </li>
          <li className='nav-item'>
            <NavLink activeClassName='active' className='nav-link' to='/search'>
              <i className='fas fa-search'></i>
              &nbsp;Search
            </NavLink>
          </li>
          <li className='nav-item'>
            <NavLink
              activeClassName='active'
              className='nav-link'
              to='/reservations/new'
            >
              <i className='fas fa-plus'></i>
              &nbsp;New Reservation
            </NavLink>
          </li>
          <li className='nav-item'>
            <NavLink
              activeClassName='active'
              className='nav-link'
              to='/tables/new'
            >
              <i className='fas fa-utensils'></i>
              &nbsp;New Table
            </NavLink>
          </li>
        </ul>
        <div className='text-center d-none d-md-inline'>
          <button
            className='btn rounded-circle border-0'
            id='sidebarToggle'
            type='button'
          />
        </div>
      </div>
    </nav>
  );
}

export default Menu;
