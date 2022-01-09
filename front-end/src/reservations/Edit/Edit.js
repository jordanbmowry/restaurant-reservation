import React from 'react';
import ReservationsForm from '../ReservationsForm';

export default function Edit() {
  return (
    <section>
      <h1>Edit Reservation</h1>
      <ReservationsForm method='PUT' />
    </section>
  );
}
