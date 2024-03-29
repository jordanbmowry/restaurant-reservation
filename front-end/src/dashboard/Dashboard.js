import React, { useEffect, useState } from 'react';
import snackbar from 'snackbar';
import useFetch, { listReservations } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';
import useQuery from '../utils/useQuery.js';
import { formatDisplayDate } from '../utils/date-time';
import Loader from '../layout/Loader';
import CurrentTime from '../layout/CurrentTime';
import ReservationList from '../reservations/ReservationList/ReservationList';
import TablesList from '../tables/TablesList/TablesList';
import DateNavigation from './DateNavigation';
import Divider from '../layout/Divider.js';

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

  useEffect(() => {
    const showDeleteSnackbar = sessionStorage.getItem(
      'snackbarCancelReservation'
    );
    if (showDeleteSnackbar) {
      snackbar.show('Reservation canceled.');
      sessionStorage.removeItem('snackbarCancelReservation');
    }

    const showFinishedTableSnackBar = sessionStorage.getItem(
      'snackbarFinishTable'
    );
    if (showFinishedTableSnackBar) {
      snackbar.show('Finished table.');
      sessionStorage.removeItem('snackbarFinishTable');
    }
  }, []);

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
  }, [get]);

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
    <>
      <DateNavigation date={date} />
      <h4 className='font-weight-light text-center'>{displayDate}</h4>
      <main>
        <h1 className='my-4'>Dashboard</h1>
        <CurrentTime />
        <Divider />
        <h3 className='my-4 font-weight-bold'>Reservations</h3>
        <div className='d-md-flex mb-3'></div>
        <ErrorAlert error={reservationsError} />
        {reservationsIsLoading ? (
          <Loader />
        ) : (
          <ReservationList reservations={reservations} />
        )}
        <Divider />
        <h3 className='my-4 font-weight-bold'>Tables</h3>
        <ErrorAlert error={tablesError} />
        {tablesIsLoading ? <Loader /> : <TablesList tables={tables} />}
      </main>
    </>
  );
}

export default Dashboard;
