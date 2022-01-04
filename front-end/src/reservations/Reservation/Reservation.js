import React from 'react';
import SeatButton from '../SeatButton/SeatButton';
import clsx from 'clsx';

export default function Reservation({ reservation }) {
  const {
    reservation_id,
    first_name,
    last_name,
    mobile_number,
    reservation_time,
    people,
    status,
  } = reservation;

  const classNames = clsx({
    'border-primary': status === 'booked',
    'text-primary': status === 'booked',
    'border-success': status === 'seated',
    'text-success': status === 'seated',
  });

  return (
    <div className='card' style={{ width: '18rem' }}>
      <div className='card-body text-center'>
        <p className='card-text'>{reservation_time}</p>
        <h5 className='card-title'>{`${first_name} ${last_name}`}</h5>
        <h6 className='card-text'>Party of: {people}</h6>
        <p className='card-text'>{mobile_number}</p>
        <p className={`w-100 border my-3 py-3 font-weight-bold ${classNames}`}>
          Status: {status}
        </p>
        <div className='text-center'>
          {status === 'booked' ? (
            <SeatButton reservation_id={reservation_id} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
