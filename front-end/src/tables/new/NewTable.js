import React, { useState } from 'react';
import Form from '../../layout/Form';
import FormInput from '../../layout/FormInput';
import Button from '../../layout/Button';
import { useHistory } from 'react-router';
import useFetch from '../../utils/api';
import ErrorAlert from '../../layout/ErrorAlert';

export default function NewTable() {
  const [error, setError] = useState(null);
  const history = useHistory();
  const { post } = useFetch();

  const initialFormState = {
    table_name: '',
    capacity: '',
  };

  const [formData, setFormData] = useState({ ...initialFormState });

  const handleChange = ({ target }) => {
    if (target.name === 'capacity' && typeof target.value === 'string') {
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

  const submitNewTable = async (event) => {
    event.preventDefault();
    const controller = new AbortController();
    try {
      await post('/tables', formData, controller);
      setFormData({ ...initialFormState });
      history.push(`/dashboard`);
    } catch (error) {
      setError(error);
    } finally {
      return () => controller.abort();
    }
  };

  return (
    <section>
      <Form>
        <FormInput
          name='table_name'
          minLength='2'
          label='Table Name'
          id='table_name'
          onChange={handleChange}
          value={formData.table_name}
          required
        />
        <FormInput
          name='capacity'
          min='1'
          label='Capacity'
          type='number'
          id='capacity'
          onChange={handleChange}
          value={formData.capacity}
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
    </section>
  );
}
