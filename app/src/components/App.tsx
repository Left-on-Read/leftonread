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
import ChartDataLabels from 'chartjs-plugin-datalabels';
import gradient from 'chartjs-plugin-gradient';
import { useEffect, useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';

import LogoWithTextFromGraphExport from '../../assets/LogoWithTextForGraphExport.svg';
import { theme } from '../theme';
import { Dashboard } from './Dashboard/Dashboard';
import { ErrorBoundary } from './ErrorBoundary';
import { Home } from './Home/Home';
import { Redirecter } from './Home/Redirecter';
import { Initializer } from './Initializer';

Chart.register(...(registerables ?? []));

Chart.register(ChartDataLabels);

Chart.register(gradient);

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
        image.crossOrigin = 'anonymous'; // need to set to anonymous in order to export
        image.src = LogoWithTextFromGraphExport;
        if (image.complete) {
          // ctx is a CanvasRenderingContext2D
          const { ctx, scales, chartArea } = chart;
          const { yAxis } = scales;
          ctx.font = '13px montserrat';
          ctx.fillText(
            'leftonread.me/download',
            chartArea.right - 155,
            yAxis.bottom + 40
          );
          ctx.drawImage(image, 45, yAxis.bottom + 25);
          ctx.save(); // not sure if this .save() is even needed
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
