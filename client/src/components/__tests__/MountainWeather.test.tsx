import MountainWeather from '../MountainWeather';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('https://api.weatherapi.com/v1/forecast.json', (req, res, ctx) => {
    return res(
      ctx.json({
        forecast: {
          forecastday: [
            {
              day: {
                condition: {
                  text: 'Sunny',
                  icon: 'fakeurl',
                },
                avgtemp_f: 72.3,
                daily_chance_of_snow: 0,
                totalprecip_in: 0,
              },
            },
            {
              day: {
                condition: {
                  text: 'Snowy',
                  icon: 'fakeurl',
                },
                avgtemp_f: 28,
                daily_chance_of_snow: 0.95,
                totalprecip_in: 5.5,
              },
            },
          ],
        },
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('Renders properly after loading data', async () => {
  const component = render(
    <Router>
      <MountainWeather
        name="Test Location"
        location={12345}
        completeLoading={() => {}}
      />
    </Router>
  );

  await waitFor(() =>
    expect(
      screen.getByRole('heading', { name: 'Test Location' })
    ).toBeInTheDocument()
  );

  expect(component).toMatchSnapshot();
});
