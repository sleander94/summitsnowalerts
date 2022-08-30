import Signup from '../account-actions/Signup';
import { render, cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';

afterEach(cleanup);
const user = userEvent.setup();

it('Updates name properly', async () => {
  render(
    <Router>
      <Signup />
    </Router>
  );

  const input = screen.getByRole('textbox', { name: 'name' });

  expect(input.textContent).toBe('');
  await user.type(input, 'Test');
  expect(input).toHaveValue('Test');
});

it('Displays name validation error properly', async () => {
  render(
    <Router>
      <Signup />
    </Router>
  );

  const input = screen.getByRole('textbox', { name: 'name' });

  // Error message only displays after focusing and blurring input
  expect(screen.queryByText('Enter your first name.')).not.toBeInTheDocument();
  await user.click(input);
  await user.click(document.body);
  expect(screen.getByText('Enter your first name.')).toBeInTheDocument();

  await user.clear(input);

  // Valid name
  await user.type(input, 'Test');
  await user.click(document.body);
  expect(screen.queryByText('Enter your first name.')).not.toBeInTheDocument();
});

it('Updates email properly', async () => {
  render(
    <Router>
      <Signup />
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
      <Signup />
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

it('Updates password properly', async () => {
  render(
    <Router>
      <Signup />
    </Router>
  );

  const input = screen.getByLabelText('Password *');

  expect(input.textContent).toBe('');
  await user.type(input, 'testpass');
  expect(input).toHaveValue('testpass');
});

it('Displays password validation error properly', async () => {
  render(
    <Router>
      <Signup />
    </Router>
  );

  const input = screen.getByLabelText('Password *');

  // Short password
  expect(
    screen.queryByText(
      'Password must be at least 6 characters with 1 letter and 1 number.'
    )
  ).not.toBeInTheDocument();
  await user.type(input, 'test5');
  await user.click(document.body);
  expect(
    screen.getByText(
      'Password must be at least 6 characters with 1 letter and 1 number.'
    )
  ).toBeInTheDocument();

  await user.clear(input);

  // Acceptable password
  await user.type(input, 'whatagreatpassword123');
  await user.click(document.body);
  expect(
    screen.queryByText(
      'Password must be at least 6 characters with 1 letter and 1 number.'
    )
  ).not.toBeInTheDocument();

  await user.clear(input);

  // Password without number
  await user.type(input, 'longpassword');
  await user.click(document.body);
  expect(
    screen.getByText(
      'Password must be at least 6 characters with 1 letter and 1 number.'
    )
  ).toBeInTheDocument();
});

it('Updates confirm password properly', async () => {
  render(
    <Router>
      <Signup />
    </Router>
  );

  const input = screen.getByLabelText('Confirm Password *');

  expect(input.textContent).toBe('');
  await user.type(input, 'testpass');
  expect(input).toHaveValue('testpass');
});

it('Displays confirm password validation error properly', async () => {
  render(
    <Router>
      <Signup />
    </Router>
  );

  const password = screen.getByLabelText('Password *');
  const confirmPassword = screen.getByLabelText('Confirm Password *');

  // Mismatched passwords
  expect(screen.queryByText("Passwords don't match.")).not.toBeInTheDocument();
  await user.type(password, 'test');
  await user.type(confirmPassword, 'Teeoifcmst');
  await user.click(document.body);
  expect(screen.getByText("Passwords don't match.")).toBeInTheDocument();

  await user.clear(password);
  await user.clear(confirmPassword);

  // Matching passwords
  await user.type(password, 'whatagreatpassword123');
  await user.type(confirmPassword, 'whatagreatpassword123');
  await user.click(document.body);
  expect(screen.queryByText("Passwords don't match.")).not.toBeInTheDocument();
});
