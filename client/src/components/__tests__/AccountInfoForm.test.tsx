import AccountInfoForm from '../account-actions/AccountInfoForm';
import {
  render,
  cleanup,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { mockUserData } from '../../mockUserData';

const server = setupServer(
  rest.get('/users', (req, res, ctx) => {
    return res(ctx.json(mockUserData));
  }),
  rest.put('/users', (req, res, ctx) => {
    return res(ctx.status(400), ctx.json({ message: 'Bad Request.' }));
  })
);

const user = userEvent.setup();

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  cleanup;
});
afterAll(() => server.close());

it('Renders with correct user data displayed after fetch', async () => {
  const component = render(
    <Router>
      <AccountInfoForm user={mockUserData} />
    </Router>
  );

  await waitFor(() =>
    expect(screen.getByText('Test User')).toBeInTheDocument()
  );
  expect(screen.getByText('(555)555-5555')).toBeInTheDocument();
  expect(screen.getByText('test@email.com')).toBeInTheDocument();

  expect(component).toMatchSnapshot();
});

it('Displays name input field & saves user input', async () => {
  const component = render(
    <Router>
      <AccountInfoForm user={mockUserData} />
    </Router>
  );

  const field = await waitFor(() => screen.getByTestId('name'));
  expect(field).toBeInTheDocument();

  const { getByRole, queryByRole, getByText } = within(field);
  let button = getByRole('button');
  expect(button).toBeInTheDocument();

  await user.click(button);

  const input = getByRole('textbox');
  expect(input).toHaveValue('Test User');

  await user.clear(input);
  await user.type(input, 'New Name');
  expect(input).toHaveValue('New Name');

  button = getByRole('button');
  await user.click(button);
  expect(queryByRole('textbox')).not.toBeInTheDocument();
  expect(getByText('New Name')).toBeInTheDocument();
});

it('Displays error message when name field is empty', async () => {
  const component = render(
    <Router>
      <AccountInfoForm user={mockUserData} />
    </Router>
  );

  const field = await waitFor(() => screen.getByTestId('name'));

  const { getByRole, queryByRole, getByText } = within(field);

  let button = getByRole('button');
  await user.click(button);

  const input = getByRole('textbox');

  await user.clear(input);

  button = getByRole('button');
  await user.click(button);

  expect(queryByRole('textbox')).toBeInTheDocument();
  expect(getByText('Enter a name.')).toBeInTheDocument();
});

it('Displays email input field & saves user input', async () => {
  const component = render(
    <Router>
      <AccountInfoForm user={mockUserData} />
    </Router>
  );

  const field = await waitFor(() => screen.getByTestId('email'));
  expect(field).toBeInTheDocument();

  const { getByRole, queryByRole, getByText } = within(field);
  let button = getByRole('button');
  expect(button).toBeInTheDocument();

  await user.click(button);

  const input = getByRole('textbox');
  expect(input).toHaveValue('test@email.com');

  await user.clear(input);
  await user.type(input, 'coolemail@gmail.com');
  expect(input).toHaveValue('coolemail@gmail.com');

  button = getByRole('button');
  await user.click(button);
  expect(queryByRole('textbox')).not.toBeInTheDocument();
  expect(getByText('coolemail@gmail.com')).toBeInTheDocument();
});

it('Displays error message when email field is invalid', async () => {
  const component = render(
    <Router>
      <AccountInfoForm user={mockUserData} />
    </Router>
  );

  const field = await waitFor(() => screen.getByTestId('email'));

  const { getByRole, queryByRole, getByText } = within(field);

  let button = getByRole('button');
  await user.click(button);

  const input = getByRole('textbox');

  await user.clear(input);
  expect(getByText('Enter a valid email.')).toBeInTheDocument();

  await user.type(input, 'bademail.com');
  expect(getByText('Enter a valid email.')).toBeInTheDocument();

  button = getByRole('button');
  await user.click(button);

  expect(queryByRole('textbox')).toBeInTheDocument();
  expect(getByText('Enter a valid email.')).toBeInTheDocument();
});

it('Displays phone input field & saves user input', async () => {
  render(
    <Router>
      <AccountInfoForm user={mockUserData} />
    </Router>
  );

  const field = await waitFor(() => screen.getByTestId('phone'));
  expect(field).toBeInTheDocument();

  const { getByRole, queryByRole, getByText } = within(field);
  let button = getByRole('button');
  expect(button).toBeInTheDocument();

  await user.click(button);

  const input = getByRole('textbox');
  expect(input).toHaveValue('(555)555-5555');

  await user.clear(input);
  await user.type(input, '7191234567');
  expect(input).toHaveValue('7191234567');

  button = getByRole('button');
  await user.click(button);
  expect(queryByRole('textbox')).not.toBeInTheDocument();
  expect(getByText('7191234567')).toBeInTheDocument();
});

it('Displays error message when phone field is invalid', async () => {
  const component = render(
    <Router>
      <AccountInfoForm user={mockUserData} />
    </Router>
  );

  const field = await waitFor(() => screen.getByTestId('phone'));

  const { getByRole, queryByRole, getByText } = within(field);

  let button = getByRole('button');
  await user.click(button);

  const input = getByRole('textbox');

  await user.clear(input);
  await user.type(input, '5555555a');

  button = getByRole('button');
  await user.click(button);

  expect(queryByRole('textbox')).toBeInTheDocument();
  expect(getByText('Phone number cannot contain letters.')).toBeInTheDocument();
});

it('Displays new password & confirm password input fields & saves user input', async () => {
  render(
    <Router>
      <AccountInfoForm user={mockUserData} />
    </Router>
  );

  let button = await waitFor(() => screen.getByTestId('pass-button'));
  expect(button).toBeInTheDocument();

  await user.click(button);

  let passInput = screen.getByTestId('pass-input');
  let confirmPassInput = screen.getByTestId('confirm-pass-input');

  await user.type(passInput, 'goodpassword1');
  expect(passInput).toHaveValue('goodpassword1');

  await user.type(confirmPassInput, 'goodpassword1');
  expect(confirmPassInput).toHaveValue('goodpassword1');

  button = screen.getByTestId('pass-button');
  await user.click(button);
  expect(screen.getByText('*************')).toBeInTheDocument();
});

it('Displays error message when invalid new password is entered', async () => {
  render(
    <Router>
      <AccountInfoForm user={mockUserData} />
    </Router>
  );

  let button = await waitFor(() => screen.getByTestId('pass-button'));
  expect(button).toBeInTheDocument();

  await user.click(button);

  let passInput = screen.getByTestId('pass-input');
  let confirmPassInput = screen.getByTestId('confirm-pass-input');

  await user.type(passInput, 'short');
  await user.type(confirmPassInput, 'short');

  button = screen.getByTestId('pass-button');
  await user.click(button);

  expect(passInput).toBeInTheDocument();
  expect(confirmPassInput).toBeInTheDocument();
  expect(
    screen.getByText('6+ characters with 1 letter and 1 number.')
  ).toBeInTheDocument();
});

it('Displays error message when passwords do not match', async () => {
  render(
    <Router>
      <AccountInfoForm user={mockUserData} />
    </Router>
  );

  let button = await waitFor(() => screen.getByTestId('pass-button'));
  expect(button).toBeInTheDocument();

  await user.click(button);

  let passInput = screen.getByTestId('pass-input');
  let confirmPassInput = screen.getByTestId('confirm-pass-input');

  await user.type(passInput, 'password123');
  await user.type(confirmPassInput, 'password122');

  button = screen.getByTestId('pass-button');
  await user.click(button);

  expect(passInput).toBeInTheDocument();
  expect(confirmPassInput).toBeInTheDocument();
  expect(screen.getByText("Passwords don't match.")).toBeInTheDocument();
});

it('Displays error message on submission with invalid password', async () => {
  render(
    <Router>
      <AccountInfoForm user={mockUserData} />
    </Router>
  );

  let button = await waitFor(() => screen.getByText('Save'));

  await user.click(button);

  await waitFor(() =>
    expect(
      screen.getByText('Error updating account. Please try again.')
    ).toBeInTheDocument()
  );
});

it('Displays error message on submission with valid, but incorrect password', async () => {
  server.use(
    rest.put('/users', (req, res, ctx) => {
      return res(ctx.status(401), ctx.json({ message: 'Incorrect Password.' }));
    })
  );
  render(
    <Router>
      <AccountInfoForm user={mockUserData} />
    </Router>
  );

  let button = await waitFor(() => screen.getByText('Save'));

  await user.click(button);

  await waitFor(() =>
    expect(screen.getByText('Incorrect password.')).toBeInTheDocument()
  );
});

it('Displays confirmation message after successfully updating account', async () => {
  server.use(
    rest.put('/users', (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ message: 'Account updated successfully.' })
      );
    })
  );
  render(
    <Router>
      <AccountInfoForm user={mockUserData} />
    </Router>
  );

  let button = await waitFor(() => screen.getByText('Save'));

  await user.click(button);

  await waitFor(() =>
    expect(
      screen.getByText('Account updated successfully.')
    ).toBeInTheDocument()
  );
});
