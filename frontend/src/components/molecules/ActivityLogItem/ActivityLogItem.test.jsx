import { render, screen } from '@testing-library/react';
import ActivityLogItem from './ActivityLogItem';

test('renderiza el elemento del log de actividad', () => {
  render(<ActivityLogItem activity={{ action: 'Creó paciente', timestamp: '2024-01-01' }} />);
  expect(screen.getByText('Creó paciente')).toBeInTheDocument();
}); 