import React from 'react';
import Table from '../table/Table';
import { Link } from 'react-router-dom';

export default function TablesList({ tables }) {
  const noTablesMessage = (
    <p>
      There are no tables- create a
      <Link className='nav-link' to='/tables/new'>
        New Table
      </Link>
    </p>
  );
  console.log(tables);
  const mappedTables = tables.map((table) => (
    <Table key={table.table_id} table={table} />
  ));

  return tables ? (
    <div className='grid-wrapper'>{mappedTables}</div>
  ) : (
    noTablesMessage
  );
}
