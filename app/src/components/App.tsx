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

import LogoWithTextFromGraphExport from '../../assets/LogoWithTextForGraphExport.svg';
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
        image.crossOrigin = 'anonymous'; // need to set to anonymous in order to export
        image.src = LogoWithTextFromGraphExport;
        if (image.complete) {
          // CanvasRenderingContext2D
          console.log(chart);
          const { ctx, scales, chartArea } = chart;
          const { xAxis, yAxis } = scales;
          // ctx.save();

          // console.log(xAxis, yAxis);
          // const x = left + width - image.width;
          // const y = top + height - image.height;
          // ctx.drawImage(image, x, y);
          // ctx.height += 200;
          ctx.drawImage(
            image,
            chartArea.right - image.width - 15,
            yAxis.bottom + 35
          );
          ctx.save();
          // ctx.restore();
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
