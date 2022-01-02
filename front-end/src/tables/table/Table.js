import React from 'react';
import clsx from 'clsx';

export default function Table(props) {
  const { table_name, capacity, table_id, status } = props.table;
  const occupied = props.table.reservation_id;

  const classNames1 = clsx(
    { card: true, 'border-dark': occupied, 'border-primary': !occupied },
    props.className
  );

  const classNames2 = clsx({
    'text-success': occupied,
    'text-secondary': !occupied,
  });

  return (
    <div className={classNames1}>
      <div className='card-body'>
        <h5 className='card-title'>Table: {table_name}</h5>
        <h6 className='card-subtitle mb-2'>
          <span data-table-id-status={`${table_id}`} className={classNames2}>
            Status: {occupied ? 'occupied' : 'free'}
          </span>
        </h6>
        <p className={`card-text ${classNames2}`}>Capacity: {capacity}</p>
      </div>
    </div>
  );
}
