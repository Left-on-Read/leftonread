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

  // const image = new Image();
  // image.src = 'https://www.chartjs.org/img/chartjs-logo.svg';
  // id: 'customImage',
  // beforeDraw: (chart: any) => {
  //   if (image.complete) {
  //     const { ctx } = chart;
  //     const { top, left, width, height } = chart.chartArea;
  //     const x = left + width - image.width;
  //     const y = top + height - image.height;
  //     ctx.drawImage(image, x, y);
  //   } else {
  //     image.onload = () => chart.draw();
  //   }
  // },

  // Give every chart a white background color for export reasons
  // https://stackoverflow.com/questions/69357233/background-color-of-the-chart-area-in-chartjs-not-working
  useEffect(() => {
    Chart.register({
      id: 'custom_canvas_background_color',
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
