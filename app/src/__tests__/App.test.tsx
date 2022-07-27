import '@testing-library/jest-dom';

import { render } from '@testing-library/react';

import { App } from '../components/App';

jest.mock('chart.js')

describe('App', () => {
  it('should render', () => {
    expect(render(<App />)).toBeTruthy();
  });
});
