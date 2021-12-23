import React from 'react';
import Loader from '../utils/Loader';

import { Route, Switch, useRouteMatch } from 'react-router-dom';
import New from './new/New';

export default function Reservations(props) {
  const { path } = useRouteMatch();

  return (
    <main>
      <Switch>
        <Route path={`${path}/new`}>
          <New />
        </Route>
      </Switch>
    </main>
  );
}
