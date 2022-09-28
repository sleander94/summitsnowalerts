import Loading from '../Loading';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';

it('Renders correctly', () => {
  const component = render(
    <Router>
      <Loading />
    </Router>
  );

  expect(component).toMatchSnapshot();
});
