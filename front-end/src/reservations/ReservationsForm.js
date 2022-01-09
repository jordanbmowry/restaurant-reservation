import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { today, formatAsTime } from '../utils/date-time';
import Form from '../layout/Form';
import FormInput from '../layout/FormInput.js';
import Button from '../layout/Button';
import ErrorAlert from '../layout/ErrorAlert';
import useFetch from '../utils/api';

export default function ReservationsForm({ method }) {
  const { post, get, put } = useFetch();
  const history = useHistory();
  const { reservation_id } = useParams();
  const [error, setError] = useState(null);
  const initialFormState = {
    first_name: '',
    last_name: '',
    mobile_number: '',
    reservation_date: today(),
    reservation_time: formatAsTime(new Date().toTimeString()),
    people: 1,
  };

  const [formData, setFormData] = useState({ ...initialFormState });

  useEffect(() => {
    if (method === 'PUT') {
      const controller = new AbortController();
      async function fetchReservationToEdit(reservation_id) {
        try {
          const { data } = await get(
            `/reservations/${reservation_id}`,
            controller
          );
          data.reservation_date = today(data.reservation_date);
          data.people = parseInt(data.people, 10);
          setFormData(data);
        } catch (error) {
          setError(error);
        }
      }
      fetchReservationToEdit(reservation_id);
      return () => controller.abort();
    }
  }, [reservation_id, method]);

  const handleChange = ({ target }) => {
    if (
      target.name === 'people' &&
      typeof target.value === 'string' &&
      target.value !== ''
    ) {
      setFormData({
        ...formData,
        [target.name]: Number.parseInt(target.value, 10),
      });
    } else {
      setFormData({
        ...formData,
        [target.name]: target.value,
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    method === 'POST' ? submitNew() : submitEdit();
  };

  const submitNew = async () => {
    const controller = new AbortController();
    try {
      await post('/reservations', formData, controller);
      setFormData({ ...initialFormState });
      history.push(`/dashboard?date=${formData.reservation_date}`);
    } catch (error) {
      setError(error);
    } finally {
      return () => controller.abort();
    }
  };

  const submitEdit = async () => {
    const {
      created_at,
      updated_at,
      reservation_id: _,
      status,
      ...rest
    } = formData;
    const controller = new AbortController();
    try {
      await put(`/reservations/${reservation_id}`, rest, controller);
      history.push(`/dashboard?date=${formData.reservation_date}`);
    } catch (error) {
      setError(error);
    }
  };

  return (
    <Form handleSubmit={handleSubmit}>
      <FormInput
        name='first_name'
        label='First Name'
        id='first-name'
        onChange={handleChange}
        value={formData.first_name}
        required
      />
      <FormInput
        name='last_name'
        label='Last Name'
        id='last-name'
        onChange={handleChange}
        value={formData.last_name}
        required
      />
      <FormInput
        name='mobile_number'
        label='Mobile Number'
        id='mobile-number'
        onChange={handleChange}
        type='tel'
        value={formData.mobile_number}
        required
      />
      <FormInput
        name='reservation_date'
        label='Reservation Date'
        id='reservation-date'
        onChange={handleChange}
        type='date'
        value={formData.reservation_date}
        placeholder='YYYY-MM-DD'
        pattern='\d{4}-\d{2}-\d{2}'
        required
      />
      <FormInput
        name='reservation_time'
        label='Reservation Time'
        id='reservation-time'
        onChange={handleChange}
        type='time'
        value={formData.reservation_time}
        placeholder='HH:MM'
        pattern='[0-9]{2}:[0-9]{2}'
        required
      />
      <FormInput
        name='people'
        label='People'
        id='people'
        onChange={handleChange}
        type='number'
        value={formData.people}
        min='1'
        required
      />
      <div className='text-center'>
        <Button
          onClick={() => history.goBack()}
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
      <ErrorAlert error={error} />
    </Form>
  );
}
