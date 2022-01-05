import React, { useEffect, useState } from 'react';
import useFetch, { listReservations } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';
import useQuery from '../utils/useQuery.js';
import { formatDisplayDate } from '../utils/date-time';
import Loader from '../layout/Loader';
import CurrentTime from '../layout/CurrentTime';
import ReservationList from '../reservations/ReservationList/ReservationList';
import TablesList from '../tables/TablesList/TablesList';

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
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);
  const [reservationsIsLoading, setReservationsIsLoading] = useState(true);
  const [tablesIsLoading, setTablesIsLoading] = useState(true);

  useEffect(loadDashboard, [date]);

  useEffect(() => {
    const controller = new AbortController();
    async function loadTables() {
      try {
        const response = await get('/tables', controller);
        const { data } = response;
        setTables(data);
      } catch (error) {
        setTablesError(error);
      } finally {
        setTablesIsLoading(false);
      }
    }
    loadTables();
    return () => controller.abort();
  }, []);

  console.log(tables);
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError)
      .finally(() => setReservationsIsLoading(false));
    return () => abortController.abort();
  }

  const displayDate = formatDisplayDate(date);
  return (
    <main>
      <h1 className='my-4'>Dashboard</h1>
      <CurrentTime />
      <div className='w-100 p-2 bg-dark my-4'></div>
      <h3 className='my-4'>Reservations for:</h3>
      <h4>{displayDate}</h4>
      <div className='d-md-flex mb-3'></div>
      <ErrorAlert error={reservationsError} />
      {reservationsIsLoading ? (
        <Loader />
      ) : (
        <ReservationList reservations={reservations} />
      )}
      <div className='w-100 p-2 bg-dark mt-4'></div>
      <h3 className='my-4'>Tables:</h3>
      <ErrorAlert error={tablesError} />
      {tablesIsLoading ? <Loader /> : <TablesList tables={tables} />}
    </main>
  );
}

export default Dashboard;
