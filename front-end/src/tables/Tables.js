import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import NotFound from '../layout/NotFound';
import NewTable from './New/NewTable';

export default function Tables() {
  const { path } = useRouteMatch();
  return (
    <main>
      <Switch>
        <Route path={`${path}/new`}>
          <NewTable />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </main>
  );
}
