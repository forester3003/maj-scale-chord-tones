import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';

vi.mock('react-ga4', () => ({
  __esModule: true,
  default: { send: vi.fn(), initialize: vi.fn() },
}));

const MAJ_SCALE_TITLE = 'Major Scale & Diatonic Chord Tones';
const SCALE_AND_CHORDS_TITLE = 'Scale & Two Chords';

// The accordion header is the only button that contains an icon (svg).
const getAccordionHeader = () =>
  screen
    .getAllByRole('button')
    .find((button) => button.querySelector('svg') !== null) as HTMLElement;

beforeEach(() => {
  localStorage.clear();
});

test('shows the Major Scale view by default', () => {
  render(<App />);
  expect(getAccordionHeader()).toHaveTextContent(MAJ_SCALE_TITLE);
});

test('switches to the Scale & Two Chords view from the menu and remembers it', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: '☰' }));
  const menu = screen.getByRole('heading', { name: 'Menu' }).parentElement as HTMLElement;
  fireEvent.click(within(menu).getByRole('button', { name: SCALE_AND_CHORDS_TITLE }));

  expect(getAccordionHeader()).toHaveTextContent(SCALE_AND_CHORDS_TITLE);
  expect(localStorage.getItem('selectedView')).toBe('scaleAndChords');
});

test('restores the last selected view from localStorage', () => {
  localStorage.setItem('selectedView', 'scaleAndChords');
  render(<App />);
  expect(getAccordionHeader()).toHaveTextContent(SCALE_AND_CHORDS_TITLE);
});

test('shows the explanation when the accordion is opened', () => {
  render(<App />);
  expect(screen.queryByText(/Selects a major scale/)).not.toBeInTheDocument();
  fireEvent.click(getAccordionHeader());
  expect(screen.getByText(/Selects a major scale/)).toBeInTheDocument();
});
