import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import SeatButton from '../SeatButton/SeatButton';
import EditButton from '../EditButton/EditButton';
import CancelButton from '../CancelButton/CancelButton';
import clsx from 'clsx';
import useFetch from '../../utils/api';
import ErrorAlert from '../../layout/ErrorAlert';

export default function Reservation({ reservation }) {
  const [error, setError] = useState(null);
  const { put } = useFetch();
  const history = useHistory();
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

  const confirmCancel = async () => {
    const controller = new AbortController();
    try {
      if (
        window.confirm(
          'Do you want to cancel this reservation? This cannot be undone.'
        )
      ) {
        await put(
          `/reservations/${reservation_id}/status`,
          {
            data: { status: 'cancelled' },
          },
          controller
        );
        history.go(0);
      }
    } catch (error) {
      setError(error);
    } finally {
      return () => controller.abort();
    }
  };

  return (
    <div className='card-deck'>
      <div className={`card`} style={{ width: '18rem' }}>
        <div className='card-body text-center'>
          <p className='card-text'>{reservation_time}</p>
          <h5 className='card-title'>{`${first_name} ${last_name}`}</h5>
          <h6 className='card-text'>Party of: {people}</h6>
          <p className='card-text'>{mobile_number}</p>
          <p
            className={`w-100 border my-3 py-3 font-weight-bold ${classNames}`}
            data-reservation-id-status={reservation_id}
          >
            Status: {status}
          </p>
          <div className='text-center'>
            {status === 'booked' ? (
              <SeatButton reservation_id={reservation_id} />
            ) : null}
            <div className='d-flex justify-content-between mt-2'>
              <EditButton status={status} reservation_id={reservation_id} />
              <CancelButton
                status={status}
                onClick={confirmCancel}
                reservation_id={reservation_id}
              />
            </div>
          </div>
        </div>
        <ErrorAlert error={error} />
      </div>
    </div>
  );
}
