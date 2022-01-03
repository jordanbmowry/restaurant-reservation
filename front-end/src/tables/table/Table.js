import React from 'react';
import clsx from 'clsx';

export default function Table(props) {
  const { table_name, capacity, table_id, status } = props.table;
  const occupied = props.table.reservation_id;

  const classNames1 = clsx(
    { card: true, 'border-dark': occupied, 'border-primary': !occupied },
    'px-4',
    'py-2',
    props.className
  );

  const classNames2 = clsx({
    'text-success': occupied,
    'text-secondary': !occupied,
  });

  return (
    <div className={classNames1}>
      <div className='card-body text-center'>
        <h5 className='card-title my-2'>Table: {table_name}</h5>
        <h6 className='card-subtitle my-2'>
          <span data-table-id-status={`${table_id}`} className={classNames2}>
            Status: {occupied ? 'occupied' : 'free'}
          </span>
        </h6>
        <p className={`card-text my-2 ${classNames2}`}>Capacity: {capacity}</p>
      </div>
    </div>
  );
}
