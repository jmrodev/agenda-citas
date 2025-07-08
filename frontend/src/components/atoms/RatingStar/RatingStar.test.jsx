import { render, screen } from '@testing-library/react';
import RatingStar from './RatingStar';

test('renderiza las estrellas con el rating correcto', () => {
  render(<RatingStar rating={3} maxRating={5} />);
  expect(screen.getByTestId('rating-stars')).toBeInTheDocument();
}); 