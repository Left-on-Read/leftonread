import '@fontsource/montserrat';

import { ChakraProvider } from '@chakra-ui/react';
import { Global } from '@emotion/react';
import { Chart, registerables } from 'chart.js';
import { HashRouter, Route, Routes } from 'react-router-dom';

import { theme } from '../theme';
import { Dashboard } from './Dashboard/Dashboard';
import { ErrorBoundary } from './ErrorBoundary';
import { GetStarted } from './GetStarted/GetStarted';
import { Initialize } from './GetStarted/Initialize';

Chart.register(...(registerables ?? []));

export function App() {
  return (
    <ErrorBoundary>
      <ChakraProvider theme={theme}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<GetStarted />} />
            <Route path="/initialize" element={<Initialize />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </HashRouter>
      </ChakraProvider>
    </ErrorBoundary>
  );
}
