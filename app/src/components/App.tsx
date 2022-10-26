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
  const [isRefresh, setIsRefresh] = useState<boolean>(false);

  useEffect(() => {
    Chart.register({
      id: 'lor-chartjs-no-data-to-display-message',
      afterDraw(chart) {
        const { datasets } = chart.data;
        const hasData = datasets.find(
          (d) => d.data.length > 0 && d.data.some((item) => item !== 0)
        );

        if (!hasData) {
          const {
            chartArea: { left, top, right, bottom },
            ctx,
          } = chart;
          const centerX = (left + right) / 2;
          const centerY = (top + bottom) / 2;

          chart.clear();
          ctx.save();
          ctx.font = '24px montserrat';
          ctx.fillStyle = 'gray';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('No data to display.', centerX, centerY);
          ctx.restore();
        }
      },
    });
  }, []);

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
      id: 'lor-chartjs-logo-watermark-plugin',
      afterDraw: (
        chart: any,
        _args: any,
        options: { yPaddingText: number; yPaddingLogo: number }
      ) => {
        const image = new Image();
        image.crossOrigin = 'anonymous'; // need to set to anonymous in order to export
        image.src = LogoWithTextFromGraphExport;
        if (image.complete) {
          const { ctx, scales, chartArea } = chart;
          const { yAxis } = scales;
          ctx.font = '13px montserrat';
          ctx.fillStyle = 'gray';

          const bottom = yAxis && yAxis.bottom ? yAxis.bottom : 0;
          ctx.fillText(
            'leftonread.me/download',
            chartArea.right - 155,
            bottom + options.yPaddingText
          );
          ctx.drawImage(image, 45, bottom + options.yPaddingLogo);
          ctx.save(); // not sure if this .save() is even needed
        } else {
          image.onload = () => chart.draw();
        }
      },
    });
  }, []);

  function onRefresh() {
    setIsInitializing(true);
    setIsRefresh(true);
  }

  return (
    <ChakraProvider theme={theme}>
      <HashRouter>
        <ErrorBoundary onRefresh={() => onRefresh()}>
          <Routes>
            <Route path="/" element={<Redirecter />} />
            <Route
              path="/start"
              element={
                <Home
                  onInitialize={() => {
                    setIsRefresh(false);
                    setIsInitializing(true);
                  }}
                />
              }
            />
            <Route
              path="/dashboard"
              element={<Dashboard onRefresh={() => onRefresh()} />}
            />
          </Routes>
          <Initializer
            isRefresh={isRefresh}
            isInitializing={isInitializing}
            onUpdateIsInitializing={setIsInitializing}
          />
        </ErrorBoundary>
      </HashRouter>
    </ChakraProvider>
  );
}
