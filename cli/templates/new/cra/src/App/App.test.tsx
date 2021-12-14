import React from 'react';
import { render, screen } from '@testing-library/react';

import { App } from './App';

test('renders link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Monoreact/i);
  expect(linkElement).toBeInTheDocument();
});
