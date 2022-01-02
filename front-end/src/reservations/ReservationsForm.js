import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { today, formatAsTime } from '../utils/date-time';
import Form from '../layout/Form';
import FormInput from '../layout/FormInput.js';
import Button from '../layout/Button';
import ErrorAlert from '../layout/ErrorAlert';
import useFetch from '../utils/api';

export default function ReservationsForm({ method }) {
  const { post } = useFetch();
  const history = useHistory();
  const [error, setError] = useState(null);
  console.log(error);

  const initialFormState = {
    first_name: '',
    last_name: '',
    mobile_number: '',
    reservation_date: today(),
    reservation_time: formatAsTime(new Date().toTimeString()),
    people: 1,
  };

  const [formData, setFormData] = useState({ ...initialFormState });

  const handleChange = ({ target }) => {
    if (target.name === 'people' && typeof target.value === 'string') {
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

  const submitEdit = () => {
    // ToDo
  };

  return (
    <>
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
    </>
  );
}
