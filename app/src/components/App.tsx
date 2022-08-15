import '@fontsource/montserrat/100.css';
import '@fontsource/montserrat/200.css';
import '@fontsource/montserrat/300.css';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/montserrat/800.css';
import '@fontsource/montserrat/900.css';
import './App.css';

import { ChakraProvider } from '@chakra-ui/react';
import { Chart, registerables } from 'chart.js';
import { useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';

import { theme } from '../theme';
import { Dashboard } from './Dashboard/Dashboard';
import { ErrorBoundary } from './ErrorBoundary';
import { Home } from './Home/Home';
import { Redirecter } from './Home/Redirecter';
import { Initializer } from './Initializer';

Chart.register(...(registerables ?? []));

export function App() {
  const [isInitializing, setIsInitializing] = useState<boolean>(false);

  return (
    <ErrorBoundary>
      <ChakraProvider theme={theme}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Redirecter />} />
            <Route
              path="/start"
              element={<Home onInitialize={() => setIsInitializing(true)} />}
            />
            <Route
              path="/dashboard"
              element={<Dashboard onRefresh={() => setIsInitializing(true)} />}
            />
          </Routes>
          <Initializer
            isInitializing={isInitializing}
            onUpdateIsInitializing={setIsInitializing}
          />
        </HashRouter>
      </ChakraProvider>
    </ErrorBoundary>
  );
}
