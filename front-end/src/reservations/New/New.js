import React from 'react';
import ReservationsForm from '../ReservationsForm';

export default function New() {
  return (
    <section>
      <h1>New Reservation</h1>
      <ReservationsForm method={'POST'} />
    </section>
  );
}
