import Footer from '../Footer';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';

it('Renders correctly & links to github', () => {
  const component = render(
    <Router>
      <Footer />
    </Router>
  );

  expect(screen.getByRole('link')).toHaveAttribute(
    'href',
    'https://github.com/sleander94/summitsnowalerts'
  );

  expect(component).toMatchSnapshot();
});
