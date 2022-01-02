import React from 'react';
import Loader from '../../layout/Loader';
import Table from '../table/Table';
import { Link } from 'react-router-dom';
import { table } from '../../../../back-end/src/db/connection';

export default function TablesList({ tables }) {
  const noTablesMessage = (
    <p>
      There are no tables- create a
      <Link className='nav-link' to='/tables/new'>
        New Table
      </Link>
    </p>
  );

  const mappedTables = tables.map((table) => <Table table={table} />);

  return tables ? (
    <div className='grid-wrapper'>{mappedTables}</div>
  ) : (
    noTablesMessage
  );
}
