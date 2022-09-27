import AlertsForm from '../account-actions/AlertsForm';
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
import { mountains } from '../../mountains';

const server = setupServer(
  rest.get('/users', (req, res, ctx) => {
    return res(ctx.json(mockUserData));
  }),
  rest.put('/users', (req, res, ctx) => {
    return res(
      ctx.status(400),
      ctx.json({ message: 'Bad Request. Password too short.' })
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

it('Displays checkboxes with correct text & email values from user data', async () => {
  render(
    <Router>
      <AlertsForm user={mockUserData} />
    </Router>
  );

  await waitFor(() =>
    expect(screen.getByLabelText('Email alerts')).not.toBeChecked()
  );

  await waitFor(() =>
    expect(screen.getByLabelText('Text alerts')).toBeChecked()
  );
});

it('Changes value of checkboxes when clicked', async () => {
  render(
    <Router>
      <AlertsForm user={mockUserData} />
    </Router>
  );

  const email = await waitFor(() => screen.getByLabelText('Email alerts'));
  const text = await waitFor(() => screen.getByLabelText('Text alerts'));
  expect(email).toBeInTheDocument();
  expect(text).toBeInTheDocument();

  expect(email).not.toBeChecked();
  expect(text).toBeChecked();

  await user.click(email);
  expect(email).toBeChecked();

  await user.click(text);
  expect(text).not.toBeChecked();
});

it('Displays correct list of mountains from user data', async () => {
  render(
    <Router>
      <AlertsForm user={mockUserData} />
    </Router>
  );

  const list = await waitFor(() => screen.getByTestId('mountain-list'));
  expect(list).toBeInTheDocument();
  if (list) {
    const { getAllByRole } = within(list);
    const items = getAllByRole('listitem');
    const mountains = items.map((item) => item.textContent);
    expect(mountains).toEqual(['Breckenridge x', 'Keystone x']);
  }
});

it('Removes mountain from list on click of "x"', async () => {
  render(
    <Router>
      <AlertsForm user={mockUserData} />
    </Router>
  );

  const list = await waitFor(() => screen.getByTestId('mountain-list'));
  expect(list).toBeInTheDocument();
  if (list) {
    const { getAllByRole } = within(list);

    let items = getAllByRole('listitem');
    const firstX = getAllByRole('button')[0];
    expect(items).toHaveLength(2);
    expect(firstX).toBeInTheDocument();

    await user.click(firstX);

    items = getAllByRole('listitem');
    expect(items).toHaveLength(1);
    const mountains = items.map((item) => item.textContent);
    await waitFor(() => expect(mountains).toEqual(['Keystone x']));
  }
});

it('Renders all mountain select options from reference list', async () => {
  async () => {
    render(
      <Router>
        <AlertsForm user={mockUserData} />
      </Router>
    );
    const select = await waitFor(() =>
      screen.getByRole('combobox', { name: 'Add a mountain:' })
    );
    expect(select).toBeInTheDocument();

    const { getAllByTestId } = within(select);

    let options = getAllByTestId('select-option');
    let mountainsLength = Object.keys(mountains).length;
    expect(options).toHaveLength(mountainsLength);
  };
});

it('Adds selected mountain to list on click', async () => {
  render(
    <Router>
      <AlertsForm user={mockUserData} />
    </Router>
  );

  const list = await waitFor(() => screen.getByTestId('mountain-list'));
  expect(list).toBeInTheDocument();

  const select = await waitFor(() =>
    screen.getByRole('combobox', { name: 'Add a mountain:' })
  );

  if (list) {
    const { getAllByRole } = within(list);

    let vail = screen.getByRole('option', {
      name: 'Vail',
    }) as HTMLOptionElement;

    await user.selectOptions(select, vail);
    expect(vail.selected).toBe(true);

    await user.click(screen.getByTestId('mountain-add'));

    let items = getAllByRole('listitem');
    await waitFor(() => expect(items).toHaveLength(3));
    const mountains = items.map((item) => item.textContent);
    await waitFor(() =>
      expect(mountains).toEqual(['Breckenridge x', 'Keystone x', 'Vail x'])
    );
  }
});

it('Displays correct list of days from user data', async () => {
  render(
    <Router>
      <AlertsForm user={mockUserData} />
    </Router>
  );

  const list = await waitFor(() => screen.getByTestId('day-list'));
  expect(list).toBeInTheDocument();
  if (list) {
    const { getAllByRole } = within(list);
    const items = getAllByRole('listitem');
    const days = items.map((item) => item.textContent);
    expect(days).toEqual(['Sunday x', 'Thursday x', 'Friday x', 'Saturday x']);
  }
});

it('Removes day from list on click of "x"', async () => {
  render(
    <Router>
      <AlertsForm user={mockUserData} />
    </Router>
  );

  const list = await waitFor(() => screen.getByTestId('day-list'));
  expect(list).toBeInTheDocument();
  if (list) {
    const { getAllByRole } = within(list);

    let items = getAllByRole('listitem');
    const firstX = getAllByRole('button')[1];
    expect(items).toHaveLength(4);
    expect(firstX).toBeInTheDocument();

    await user.click(firstX);

    items = getAllByRole('listitem');
    expect(items).toHaveLength(3);
    const days = items.map((item) => item.textContent);
    await waitFor(() =>
      expect(days).toEqual(['Sunday x', 'Friday x', 'Saturday x'])
    );
  }
});

it('Renders all day selection options', async () => {
  async () => {
    render(
      <Router>
        <AlertsForm user={mockUserData} />
      </Router>
    );
    const select = await waitFor(() =>
      screen.getByRole('combobox', { name: 'Add a day:' })
    );
    expect(select).toBeInTheDocument();

    const { getAllByTestId } = within(select);

    let options = getAllByTestId('select-option');
    expect(options).toHaveLength(7);
    expect(options[0]).toHaveTextContent('Sunday');
    expect(options[6]).toHaveTextContent('Saturday');
  };
});

it('Adds selected day to list on click', async () => {
  render(
    <Router>
      <AlertsForm user={mockUserData} />
    </Router>
  );

  const list = await waitFor(() => screen.getByTestId('day-list'));
  expect(list).toBeInTheDocument();

  const select = await waitFor(() =>
    screen.getByRole('combobox', { name: 'Add a day:' })
  );

  if (list) {
    const { getAllByRole } = within(list);

    let wed = screen.getByRole('option', {
      name: 'Wednesday',
    }) as HTMLOptionElement;

    await user.selectOptions(select, wed);
    expect(wed.selected).toBe(true);

    await user.click(screen.getByTestId('day-add'));

    let items = getAllByRole('listitem');
    await waitFor(() => expect(items).toHaveLength(5));
    const days = items.map((item) => item.textContent);
    await waitFor(() =>
      expect(days).toEqual([
        'Sunday x',
        'Wednesday x',
        'Thursday x',
        'Friday x',
        'Saturday x',
      ])
    );
  }
});

it('Displays correct list of times from user data', async () => {
  render(
    <Router>
      <AlertsForm user={mockUserData} />
    </Router>
  );

  const list = await waitFor(() => screen.getByTestId('time-list'));
  expect(list).toBeInTheDocument();
  if (list) {
    const { getAllByRole } = within(list);
    const items = getAllByRole('listitem');
    const times = items.map((item) => item.textContent);
    expect(times).toEqual(['0:00 x', '8:00 x', '18:00 x']);
  }
});

it('Removes time from list on click of "x"', async () => {
  render(
    <Router>
      <AlertsForm user={mockUserData} />
    </Router>
  );

  const list = await waitFor(() => screen.getByTestId('time-list'));
  expect(list).toBeInTheDocument();
  if (list) {
    const { getAllByRole } = within(list);

    let items = getAllByRole('listitem');
    const firstX = getAllByRole('button')[0];
    expect(items).toHaveLength(3);
    expect(firstX).toBeInTheDocument();

    await user.click(firstX);

    items = getAllByRole('listitem');
    expect(items).toHaveLength(2);
    const times = items.map((item) => item.textContent);
    await waitFor(() => expect(times).toEqual(['8:00 x', '18:00 x']));
  }
});

it('Renders all time selection options', async () => {
  async () => {
    render(
      <Router>
        <AlertsForm user={mockUserData} />
      </Router>
    );
    const select = await waitFor(() =>
      screen.getByRole('combobox', { name: 'Add a time:' })
    );
    expect(select).toBeInTheDocument();

    const { getAllByTestId } = within(select);

    let options = getAllByTestId('select-option');
    expect(options).toHaveLength(24);
    expect(options[0]).toHaveTextContent('0:00');
    expect(options[23]).toHaveTextContent('23:00');
  };
});

it('Adds selected time to list on click', async () => {
  render(
    <Router>
      <AlertsForm user={mockUserData} />
    </Router>
  );

  const list = await waitFor(() => screen.getByTestId('time-list'));
  expect(list).toBeInTheDocument();

  const select = await waitFor(() =>
    screen.getByRole('combobox', { name: 'Add a time:' })
  );

  if (list) {
    const { getAllByRole } = within(list);

    let eleven = screen.getByRole('option', {
      name: '11:00',
    }) as HTMLOptionElement;

    await user.selectOptions(select, eleven);
    expect(eleven.selected).toBe(true);

    await user.click(screen.getByTestId('time-add'));

    let items = getAllByRole('listitem');
    await waitFor(() => expect(items).toHaveLength(4));
    const times = items.map((item) => item.textContent);
    await waitFor(() =>
      expect(times).toEqual(['0:00 x', '8:00 x', '11:00 x', '18:00 x'])
    );
  }
});

it('Displays error message when submitting with invalid password', async () => {
  render(
    <Router>
      <AlertsForm user={mockUserData} />
    </Router>
  );

  await waitFor(() => user.click(screen.getByRole('button', { name: 'Save' })));

  await waitFor(() =>
    expect(
      screen.getByText('Bad request. Password incorrect.')
    ).toBeInTheDocument()
  );
});

it('Displays error message when submitting with valid, but incorrect password', async () => {
  server.use(
    rest.put('/users', (req, res, ctx) => {
      return res(ctx.status(401), ctx.json({ message: 'Incorrect Password.' }));
    })
  );

  render(
    <Router>
      <AlertsForm user={mockUserData} />
    </Router>
  );

  await waitFor(() => user.click(screen.getByRole('button', { name: 'Save' })));

  await waitFor(() =>
    expect(screen.getByText('Incorrect password.')).toBeInTheDocument()
  );
});

it('Displays confirmation message after successfully updating user data', async () => {
  server.use(
    rest.put('/users', (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ message: 'User updated successfully.' })
      );
    })
  );

  render(
    <Router>
      <AlertsForm user={mockUserData} />
    </Router>
  );

  await waitFor(() => user.click(screen.getByRole('button', { name: 'Save' })));

  await waitFor(() =>
    expect(
      screen.getByText('Alert settings updated successfully.')
    ).toBeInTheDocument()
  );
});
