import React from 'react';
import { Link } from 'react-router-dom';

export default function EditButton({ reservation_id, status }) {
  return (
    status !== 'cancelled' && (
      <Link
        className='btn btn-secondary d-inline-block'
        to={`/reservations/${reservation_id}/edit`}
      >
        <i className='fas fa-edit'></i> Edit
      </Link>
    )
  );
}
