import React, { useState } from 'react';
import clsx from 'clsx';
import Button from '../../layout/Button';
import useFetch from '../../utils/api';
import { useHistory } from 'react-router-dom';
import ErrorAlert from '../../layout/ErrorAlert';

export default function Table(props) {
  const { table_name, capacity, table_id } = props.table;
  const occupied = props.table.reservation_id;
  const history = useHistory();
  const { destroy } = useFetch();
  const [error, setError] = useState(null);

  const classNames1 = clsx(
    { card: true, 'border-danger': occupied, 'border-success': !occupied },
    'px-4',
    'py-2',
    props.className
  );

  const classNames2 = clsx({
    'text-danger': occupied,
    'text-success': !occupied,
  });

  const displayConditions = clsx({
    'd-none': !occupied,
    'd-inline-block': occupied,
  });

  const handleClick = async () => {
    const controller = new AbortController();
    try {
      if (
        window.confirm(
          'Is this table ready to seat new guests? This cannot be undone.'
        )
      ) {
        await destroy(`/tables/${table_id}/seat`, controller);
        sessionStorage.setItem('snackbarFinishTable', 'true');
        history.go(0);
      }
    } catch (error) {
      setError(error);
    } finally {
      return () => controller.abort();
    }
  };

  return (
    <div className={classNames1}>
      <div className='card-body text-center'>
        <h5 className='card-title my-2'>Table: {table_name}</h5>
        <h6 className='card-subtitle my-2'>
          <span data-table-id-status={`${table_id}`} className={classNames2}>
            Status: {occupied ? 'occupied' : 'free'}
          </span>
        </h6>
        <p className={`card-text my-2`}>Capacity: {capacity}</p>
        <Button
          type='button'
          data-table-id-finish={table_id}
          btnDanger
          className={displayConditions}
          onClick={handleClick}
        >
          Finish
        </Button>
        <ErrorAlert error={error} />
      </div>
    </div>
  );
}
