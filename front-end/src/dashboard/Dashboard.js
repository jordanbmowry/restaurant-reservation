import React, { useEffect, useState } from 'react';
import { listReservations } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';
import useQuery from '../utils/useQuery.js';
import { formatDisplayDate } from '../utils/date-time';
import Loader from '../utils/Loader';

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const dateInUrl = useQuery().get('date');
  if (dateInUrl) {
    date = dateInUrl;
  }

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  console.log(reservations);
  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError)
      .finally(() => setIsLoading(false));
    return () => abortController.abort();
  }

  const displayDate = formatDisplayDate(new Date(date));
  return (
    <main>
      <h1>Dashboard</h1>
      <h4 className='mb-0'>Reservations for date:</h4>
      <h2>{displayDate}</h2>
      <div className='d-md-flex mb-3'></div>
      <ErrorAlert error={reservationsError} />
      {isLoading ? <Loader /> : JSON.stringify(reservations)}
    </main>
  );
}

export default Dashboard;
