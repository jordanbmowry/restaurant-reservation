import React from 'react';
import NotFound from '../layout/NotFound';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import New from './New/New';
import Seat from './Seat/Seat';

export default function Reservations(props) {
  const { path } = useRouteMatch();

  return (
    <main>
      <Switch>
        <Route path={`${path}/new`}>
          <New />
        </Route>
        <Route path={`${path}/:reservation_id/seat`}>
          <Seat />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </main>
  );
}
