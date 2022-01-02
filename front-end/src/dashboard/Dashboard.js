import React, { useEffect, useState } from 'react';
import useFetch, { listReservations } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';
import useQuery from '../utils/useQuery.js';
import { formatDisplayDate } from '../utils/date-time';
import Loader from '../layout/Loader';
import CurrentTime from '../layout/CurrentTime';
import ReservationList from '../reservations/ReservationList/ReservationList';

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

  const { get } = useFetch();
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  function loadTables() {
    // toDo
  }

  const displayDate = formatDisplayDate(date);
  return (
    <main>
      <h1>Dashboard</h1>
      <CurrentTime />
      <div className='w-100 p-2 bg-dark mt-4'></div>
      <h3 className='mb-0'>Reservations for:</h3>
      <h4>{displayDate}</h4>
      <div className='d-md-flex mb-3'></div>
      <ErrorAlert error={reservationsError} />
      {isLoading ? <Loader /> : <ReservationList reservations={reservations} />}
      <div className='w-100 p-2 bg-dark mt-4'></div>
      <h3 className='mb-0'>Tables:</h3>
    </main>
  );
}

export default Dashboard;
