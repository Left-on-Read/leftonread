import * as React from 'react';

import { Dashboard } from './Dashboard';
import { AccessPage } from './pages/AccessPage';
import { HashRouter, Switch, Route, useLocation } from 'react-router-dom';
import { TAnalytics } from '../utils/analytics';
const Analytics: TAnalytics = require('electron').remote.getGlobal('Analytics');

export default function App() {
  return (
    <HashRouter>
      <PageLogger />
      <Switch>
        <Route path="/" exact component={AccessPage} />
        <Route path="/dashboard" exact component={Dashboard} />
      </Switch>
    </HashRouter>
  );
}

function PageLogger() {
  const location = useLocation();
  React.useEffect(() => {
    Analytics.trackPageView(location.pathname);
  }, [location]);

  return <div />;
}
