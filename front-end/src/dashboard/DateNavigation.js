import React from 'react';
import { Link } from 'react-router-dom';
import { today, next, previous } from '../utils/date-time';

export default function DateNavigation({ date }) {
  return (
    <>
      <h5 className='text-center mt-3'>Date Navigation</h5>
      <nav
        className='d-flex justify-content-center my-3'
        aria-label='Change date'
      >
        <Link
          className='btn btn-light mx-2'
          to={`/dashboard?date=${previous(date)}`}
          aria-label='Previous'
        >
          <i className='fas fa-arrow-left'></i> Previous
        </Link>
        <Link
          className='btn btn-light mx-2'
          to={`/dashboard?date=${today()}`}
          aria-label='Today'
        >
          Today
        </Link>
        <Link
          className='btn btn-light mx-2'
          to={`/dashboard?date=${next(date)}`}
          aria-label='Next'
        >
          Next <i className='fas fa-arrow-right'></i>
        </Link>
      </nav>
    </>
  );
}
