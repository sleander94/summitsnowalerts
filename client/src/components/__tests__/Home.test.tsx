import Home from '../Home';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { mockUserData } from '../../mockUserData';
import '@testing-library/jest-dom/extend-expect';

it('Renders with signup & login buttons when user is undefined', () => {
  const component = render(
    <Router>
      <Home user={undefined} />
    </Router>
  );

  expect(screen.getByText('Sign Up')).toHaveAttribute('href', '/signup');
  expect(screen.getByText('Log In')).toHaveAttribute('href', '/login');

  expect(component).toMatchSnapshot();
});

it('Renders with forecast & alerts buttons & greeting when user is logged in', () => {
  const component = render(
    <Router>
      <Home user={mockUserData} />
    </Router>
  );

  expect(screen.getByText('Welcome back, Test.'));
  expect(screen.getByText('Forecast')).toHaveAttribute('href', '/forecast');
  expect(screen.getByText('Alerts')).toHaveAttribute('href', '/alerts');

  expect(component).toMatchSnapshot();
});
