import Login from '../account-actions/Login';
import { render, cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';

afterEach(cleanup);
const user = userEvent.setup();

const mockUserData = {
  _id: 'aoifh73$%D3g3',
  name: 'Test User',
  email: 'test@email.com',
  phone: '(555)555-5555',
  password: 'aorinferu142431e5e23e',
  emailAlert: true,
  textAlert: true,
  mountains: { Breckenridge: 80424 },
};

it('Updates email input properly', async () => {
  render(
    <Router>
      <Login user={undefined} />
    </Router>
  );

  const input = screen.getByRole('textbox', { name: 'email' });

  expect(input.textContent).toBe('');
  await user.type(input, 'hello');
  expect(input).toHaveValue('hello');
});

it('Displays email validation error properly', async () => {
  render(
    <Router>
      <Login user={undefined} />
    </Router>
  );

  const input = screen.getByRole('textbox', { name: 'email' });

  // Email with invalid domain
  expect(screen.queryByText('Enter a valid email.')).not.toBeInTheDocument();
  await user.type(input, 'bademail@.com');
  await user.click(document.body);
  expect(screen.getByText('Enter a valid email.')).toBeInTheDocument();

  await user.clear(input);

  // Valid email with lots of symbols
  await user.type(input, 'test@-1*%^!O@email.com');
  await user.click(document.body);
  expect(screen.queryByText('Enter a valid email.')).not.toBeInTheDocument();
});

it('Updates password input properly', async () => {
  render(
    <Router>
      <Login user={undefined} />
    </Router>
  );

  const input = screen.getByLabelText('Password *');

  expect(input.textContent).toBe('');
  await user.type(input, 'testpassword');
  expect(input).toHaveValue('testpassword');
});

it('Displays password validation error properly', async () => {
  render(
    <Router>
      <Login user={undefined} />
    </Router>
  );

  const input = screen.getByLabelText('Password *');

  // Password with no number
  expect(
    screen.queryByText(
      'Password must be at least 6 characters with 1 letter and 1 number.'
    )
  ).not.toBeInTheDocument();
  await user.type(input, 'nonumber');
  await user.click(document.body);
  expect(
    screen.getByText(
      'Password must be at least 6 characters with 1 letter and 1 number.'
    )
  ).toBeInTheDocument();

  await user.clear(input);

  // Acceptable password
  await user.type(input, 'accepted4');
  await user.click(document.body);
  expect(
    screen.queryByText(
      'Password must be at least 6 characters with 1 letter and 1 number.'
    )
  ).not.toBeInTheDocument();

  await user.clear(input);

  // Too short password
  expect(
    screen.queryByText(
      'Password must be at least 6 characters with 1 letter and 1 number.'
    )
  ).not.toBeInTheDocument();
  await user.type(input, 'bad1');
  await user.click(document.body);
  expect(
    screen.getByText(
      'Password must be at least 6 characters with 1 letter and 1 number.'
    )
  ).toBeInTheDocument();
});

it('Link routes to sign up page', async () => {
  render(
    <Router>
      <Login user={undefined} />
    </Router>
  );

  expect(screen.getByText("Don't have an account? Signup")).toHaveAttribute(
    'href',
    '/signup'
  );
});

// Test form submission & error message
