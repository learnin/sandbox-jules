import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the main heading', () => {
    render(<App />);
    // The App component has "Book Management App" in an h1 tag
    const headingElement = screen.getByRole('heading', { name: /book management app/i });
    expect(headingElement).toBeInTheDocument();
  });
});
