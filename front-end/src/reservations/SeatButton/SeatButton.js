import React from 'react';
import { Link } from 'react-router-dom';

export default function SeatButton({ reservation_id }) {
  return (
    <Link
      className='btn btn-primary btn-lg d-block'
      to={`/reservations/${reservation_id}/seat`}
    >
      <i className='fas fa-chair'></i> Seat
    </Link>
  );
}
