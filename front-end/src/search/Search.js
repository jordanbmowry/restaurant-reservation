import React, { useState } from 'react';
import Form from '../layout/Form.js';
import FormInput from '../layout/FormInput.js';
import Button from '../layout/Button';
import useFetch from '../utils/api.js';
import Loader from '../layout/Loader';
import ReservationList from '../reservations/ReservationList/ReservationList.js';
import ErrorAlert from '../layout/ErrorAlert';

export default function Search() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [searchedReservations, setSearchedReservations] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resultsMessage, setResultsMessage] = useState('');
  console.log(searchedReservations);
  const { get } = useFetch();
  console.log(searchedReservations);
  const handleChange = (event) => {
    setMobileNumber(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const controller = new AbortController();
    try {
      const response = await get(
        `/reservations?mobile_phone=${mobileNumber}`,
        controller
      );
      setSearchedReservations([...response.data]);
      response.data.length
        ? setResultsMessage(`${response.data.length} result(s).`)
        : setResultsMessage(`No reservations found.`);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
      return () => controller.abort();
    }
  };

  return (
    <>
      <h1>
        Lookup a Reservation by Phone Number <i className='fas fa-phone'></i>
      </h1>
      <Form handleSubmit={handleSubmit} className='my-3'>
        <FormInput
          name='mobile_number'
          label='Mobile Number'
          id='mobile-number'
          onChange={handleChange}
          type='tel'
          value={mobileNumber}
          placeholder="Enter a customer's phone number"
          required
        />
        <div className='text-center'>
          <Button type='submit' btnPrimary className='ml-2 d-inline-block'>
            Find <i className='fas fa-search'></i>
          </Button>
        </div>
      </Form>
      <ErrorAlert error={error} />
      <div className='mx-auto'>{resultsMessage}</div>
      {isLoading ? <Loader /> : null}
      {searchedReservations.length ? (
        <ReservationList reservations={searchedReservations} />
      ) : null}
    </>
  );
}
