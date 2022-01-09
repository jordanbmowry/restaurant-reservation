import React from 'react';
import Button from '../../layout/Button';

export default function CancelButton({ reservation_id, status, ...rest }) {
  return (
    status !== 'cancelled' && (
      <Button
        btnDanger
        className='d-inline-block'
        data-reservation-id-cancel={reservation_id}
        type='button'
        {...rest}
      >
        <i className='fas fa-ban'></i> Cancel
      </Button>
    )
  );
}
