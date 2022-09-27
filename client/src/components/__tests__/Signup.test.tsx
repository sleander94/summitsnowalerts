import Signup from '../account-actions/Signup';
import { render, cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.post('/users/signup', (req, res, ctx) => {
    return res(
      ctx.status(400),
      ctx.json({ message: 'That email is already taken.' })
    );
  })
);

const user = userEvent.setup();

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  cleanup;
});
afterAll(() => server.close());

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

it('Link routes to login page', () => {
  render(
    <Router>
      <Signup />
    </Router>
  );

  expect(screen.getByText('Already have an account? Log in.')).toHaveAttribute(
    'href',
    '/login'
  );
});

it("Displays error message when trying to sign up with an email that's already in use.", async () => {
  render(
    <Router>
      <Signup />
    </Router>
  );

  await user.click(screen.getByRole('button', { name: 'Create Account' }));

  await waitFor(() =>
    expect(
      screen.getByText('That email is already in use.')
    ).toBeInTheDocument()
  );
});

it('Displays error message on unsuccessful signup attempt.', async () => {
  server.use(
    rest.post('/users/signup', (req, res, ctx) => {
      return res(
        ctx.status(500),
        ctx.json({ message: 'Error creating account.' })
      );
    })
  );

  render(
    <Router>
      <Signup />
    </Router>
  );

  await user.click(screen.getByRole('button', { name: 'Create Account' }));

  await waitFor(() =>
    expect(
      screen.getByText('Error creating account. Please try again.')
    ).toBeInTheDocument()
  );
});
