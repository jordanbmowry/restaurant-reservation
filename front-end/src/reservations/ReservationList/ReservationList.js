import React from 'react';
import Reservation from '../Reservation/Reservation';

export default function ReservationList({ reservations }) {
  const noReservationsMessage = (
    <div className='mx-auto'>No reservations found.</div>
  );

  const mappedReservations = reservations.map((reservation) => (
    <Reservation key={reservation.reservation_id} reservation={reservation} />
  ));

  return (
    <div className='card-deck'>
      {reservations.length ? mappedReservations : noReservationsMessage}
    </div>
  );
}
