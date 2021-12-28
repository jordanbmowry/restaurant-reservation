import React from 'react';

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

  return (
    <div className='card' style={{ width: '18rem' }}>
      <div className='card-body'>
        <p className='card-text'>{reservation_time}</p>
        <h5 className='card-title'>{`${first_name} ${last_name}`}</h5>
        <h6 className='card-text'>Party of: {people}</h6>
        <p className='card-text'>{mobile_number}</p>
      </div>
    </div>
  );
}
