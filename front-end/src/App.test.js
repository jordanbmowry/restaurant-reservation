import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import { ThemeProvider } from './ThemeContext/ThemeContext';

test('renders title', () => {
  render(
    <ThemeProvider>
      <Router>
        <App />
      </Router>
    </ThemeProvider>
  );
  const restaurant = screen.getByText(/periodic tables/i);
  expect(restaurant).toBeInTheDocument();
});
