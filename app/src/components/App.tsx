import { ChakraProvider } from '@chakra-ui/react';
import { Chart, registerables } from 'chart.js';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Dashboard } from './Dashboard/Dashboard';

Chart.register(...(registerables ?? []));

export function TestComponent() {
  return <div />;
}

export function App() {
  return (
    <ChakraProvider>
      <BrowserRouter basename="index.html">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<TestComponent />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}
