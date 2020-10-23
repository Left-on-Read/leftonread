import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './constants/routes.json';
import WordCountChart from './components/charts/WordCount';

export default function Routes() {
  return (
    <Switch>
      <Route path={routes.COUNTER} component={WordCountChart} />
    </Switch>
  );
}
