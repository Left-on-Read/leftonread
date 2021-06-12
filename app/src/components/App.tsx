import * as React from 'react';
import { HashRouter, Route, Switch, useLocation } from 'react-router-dom';

import { TAnalytics } from '../utils/analytics';
import { Dashboard } from './Dashboard';
import { AccessPage } from './pages/AccessPage';
import { GetStartedPage } from './pages/GetStartedPage';

const Analytics: TAnalytics = require('electron').remote.getGlobal('Analytics');

function PageLogger() {
  const location = useLocation();
  React.useEffect(() => {
    Analytics.trackPageView(location.pathname);
  }, [location]);

  return <div />;
}

export default function App() {
  return (
    <HashRouter>
      <PageLogger />
      <Switch>
        <Route path="/" exact component={GetStartedPage} />
        <Route path="/access" exact component={AccessPage} />
        <Route path="/dashboard" exact component={Dashboard} />
      </Switch>
    </HashRouter>
  );
}
