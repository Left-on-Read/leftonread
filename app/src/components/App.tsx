import '@fontsource/montserrat';

import { ChakraProvider } from '@chakra-ui/react';
import { Global } from '@emotion/react';
import { Chart, registerables } from 'chart.js';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { theme } from '../theme';
import { Dashboard } from './Dashboard/Dashboard';

Chart.register(...(registerables ?? []));

export function TestComponent() {
  return <div />;
}

export function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter basename="index.html">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<TestComponent />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}
