import Navbar from '../Navbar';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { mockUserData } from '../../mockUserData';
import '@testing-library/jest-dom/extend-expect';

it('Renders with signup & login buttons for mobile & desktop menus when user is undefined', () => {
  const component = render(
    <Router>
      <Navbar user={undefined} logout={() => {}} />
    </Router>
  );

  expect(screen.getAllByText('Signup')[0]).toHaveAttribute('href', '/signup');
  expect(screen.getAllByText('Signup')[1]).toHaveAttribute('href', '/signup');

  expect(screen.getAllByText('Login')[0]).toHaveAttribute('href', '/login');
  expect(screen.getAllByText('Login')[1]).toHaveAttribute('href', '/login');

  expect(component).toMatchSnapshot();
});

it('Renders with account action buttons for mobile & desktop menus when user is logged in', () => {
  const component = render(
    <Router>
      <Navbar user={mockUserData} logout={() => {}} />
    </Router>
  );

  expect(screen.getAllByText('Forecast')[0]).toHaveAttribute(
    'href',
    '/forecast'
  );
  expect(screen.getAllByText('Forecast')[1]).toHaveAttribute(
    'href',
    '/forecast'
  );

  expect(screen.getAllByText('Alerts')[0]).toHaveAttribute('href', '/alerts');
  expect(screen.getAllByText('Alerts')[1]).toHaveAttribute('href', '/alerts');

  expect(screen.getAllByText('Account')[0]).toHaveAttribute('href', '/account');
  expect(screen.getAllByText('Account')[1]).toHaveAttribute('href', '/account');

  expect(component).toMatchSnapshot();
});
