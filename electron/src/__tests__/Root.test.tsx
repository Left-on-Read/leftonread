import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Root from '../index';

describe('Root', () => {
  it('should render', () => {
    expect(render(<Root />)).toBeTruthy();
  });
});
