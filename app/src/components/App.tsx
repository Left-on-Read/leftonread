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
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    Chart.register({
      // Give every chart a white background color for export reasons
      // https://stackoverflow.com/questions/69357233/background-color-of-the-chart-area-in-chartjs-not-workin
      id: 'lor-chartjs-white-background-for-export',
      beforeDraw: (chart: any) => {
        const ctx = chart.canvas.getContext('2d');
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
      },
    });
  }, []);

  useEffect(() => {
    Chart.register({
      id: 'lor-chartjs-logo-watermark-plugin', // can be turned off by setting to false in a given chart
      afterDraw: (chart: any) => {
        const image = new Image();
        // need to set to anonymous in order to export
        image.crossOrigin = 'anonymous';
        image.src =
          'https://raw.githubusercontent.com/Left-on-Read/leftonread/main/web/public/favicon-60.png';
        if (image.complete) {
          const ctx = chart.canvas.getContext('2d');
          const { top, left, width, height } = chart.chartArea;
          const x = left + width - image.width;
          const y = top + height - image.height;
          ctx.drawImage(image, x, y);
        } else {
          image.onload = () => chart.draw();
        }
      },
    });
  }, []);

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
