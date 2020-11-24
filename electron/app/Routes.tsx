import React from 'react';
import { Switch, Route } from 'react-router-dom';
import WordCountChart from './components/charts/WordCount';

export default function Routes() {
  return (
    <Switch>
      <Route path={"/"} component={WordCountChart} />
    </Switch>
  );
}
