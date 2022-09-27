import Forecast from '../Forecast';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { mockUserData } from '../../mockUserData';

const server = setupServer(
  rest.get('/users', (req, res, ctx) => {
    return res(ctx.json(mockUserData));
  }),
  rest.get('https://api.weatherapi.com/v1/forecast.json', (req, res, ctx) => {
    return res(
      ctx.json({
        today: {
          condition: 'Sunny',
          icon: 'fakeurl',
          avgtemp_f: '72.3',
          daily_chance_of_snow: 0,
          totalprecip_in: 0,
        },
        tomorrow: {
          condition: 'Snowy',
          icon: 'fakeurl',
          avgtemp_f: '28',
          daily_chance_of_snow: 0.95,
          totalprecip_in: 5.5,
        },
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('Displays login message when logged out', () => {
  render(
    <Router>
      <Forecast user={undefined} />
    </Router>
  );

  expect(
    screen.getByText('Log in to view the weather at your mountains.')
  ).toBeInTheDocument();
  expect(screen.queryByText('Breckenridge')).not.toBeInTheDocument();
});

it("Displays MountainWeather components for user's mountains when logged in", async () => {
  render(
    <Router>
      <Forecast user={mockUserData} />
    </Router>
  );

  await waitFor(() =>
    expect(document.getElementById('Breckenridge')).toBeInTheDocument()
  );
  await waitFor(() =>
    expect(document.getElementById('Keystone')).toBeInTheDocument()
  );
});
