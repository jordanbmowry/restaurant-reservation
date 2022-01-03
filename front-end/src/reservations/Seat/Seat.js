import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import useFetch from '../../utils/api';
import ErrorAlert from '../../layout/ErrorAlert';
import Form from '../../layout/Form';
import Button from '../../layout/Button';
import FormSelect from '../../layout/FormSelect';
import SelectOption from '../../layout/SelectOption';
import Loader from '../../layout/Loader.js';
import formatReservationDate from '../../utils/format-reservation-date';
import formatReservationTime from '../../utils/format-reservation-time.js';

export default function Seat() {
  const [isReservationLoading, setIsReservationLoading] = useState(true);
  const [areTablesLoading, setAreTablesLoading] = useState(true);

  const { get, put } = useFetch();
  const { reservation_id } = useParams();
  const history = useHistory();
  const [assignTableError, setAssignTableError] = useState(null);

  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  const [reservation, setReservation] = useState([]);
  const [reservationError, setReservationError] = useState([]);

  const [formData, setFormData] = useState({});

  // load all tables

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
        setAreTablesLoading(false);
      }
    }
    loadTables();
    return () => controller.abort();
  }, []);

  // load reservation
  useEffect(() => {
    const controller = new AbortController();
    async function loadReservations() {
      try {
        const reservation = await get(
          `reservations/${reservation_id}`,
          controller
        );
        const formattedTime = formatReservationTime(reservation);
        const formattedReservation = formatReservationDate(formattedTime);
        setReservation(formattedReservation);
      } catch (error) {
        setReservationError(error);
      } finally {
        setIsReservationLoading(false);
      }
    }
    loadReservations();
    return () => controller.abort();
  }, [reservation_id]);

  const handleSubmit = async (event) => {
    const controller = new AbortController();
    try {
      event.preventDefault();
      await put(`/tables/${formData.table_id}/seat`, {
        data: { reservation_id },
        controller,
      });
      history.push('/dashboard');
    } catch (error) {
      setAssignTableError(error);
    } finally {
      return () => controller.abort();
    }
  };

  const handleChange = (event) => {
    setFormData({ [event.target.name]: event.target.value });
  };

  const handleCancel = (event) => {
    setFormData({});
    history.goBack();
  };

  const mappedOptions = tables.map(({ table_id, table_name, capacity }) => (
    <SelectOption key={table_id} id={table_name}>
      {table_name} - {capacity}
    </SelectOption>
  ));

  return (
    <section>
      <h1>Assign Party of {reservation.people} to a table.</h1>
      <ErrorAlert error={tablesError} />
      <ErrorAlert error={reservationError} />
      <Form handleSubmit={handleSubmit}>
        <FormSelect name='tables' onChange={handleChange} required={true}>
          <option defaultValue>Table Number - Capacity Amount</option>
          {mappedOptions}
        </FormSelect>
        <div className='text-center'>
          <Button
            onClick={handleCancel}
            btnSecondary
            className='mr-2'
            type='button'
          >
            Cancel <i className='fas fa-undo-alt'></i>
          </Button>
          <Button type='submit' btnPrimary className='ml-2'>
            Submit <i className='fas fa-check'></i>
          </Button>
        </div>
      </Form>
    </section>
  );
}
