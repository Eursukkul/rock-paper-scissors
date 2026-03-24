import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ScoreBoard } from './ScoreBoard';

describe('ScoreBoard', () => {
  const defaultProps = {
    playerScore: 0,
    highScore: 0,
    onReset: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays the player score', () => {
    render(<ScoreBoard {...defaultProps} playerScore={5} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('displays the high score', () => {
    render(<ScoreBoard {...defaultProps} highScore={10} />);
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('displays 0 when playerScore is 0', () => {
    render(<ScoreBoard {...defaultProps} playerScore={0} />);
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBeGreaterThanOrEqual(1);
  });

  it('displays the Your Score label', () => {
    render(<ScoreBoard {...defaultProps} />);
    expect(screen.getByText('Your Score:')).toBeInTheDocument();
  });

  it('displays the High Score label', () => {
    render(<ScoreBoard {...defaultProps} />);
    expect(screen.getByText('High Score:')).toBeInTheDocument();
  });

  it('calls onReset when Reset Score button is clicked', async () => {
    const onReset = jest.fn();
    render(<ScoreBoard {...defaultProps} onReset={onReset} />);
    await userEvent.click(screen.getByRole('button', { name: /reset score/i }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('renders the Reset Score button', () => {
    render(<ScoreBoard {...defaultProps} />);
    expect(screen.getByRole('button', { name: /reset score/i })).toBeInTheDocument();
  });

  it('displays updated scores when props change', () => {
    const { rerender } = render(<ScoreBoard {...defaultProps} playerScore={3} highScore={7} />);
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();

    rerender(<ScoreBoard {...defaultProps} playerScore={6} highScore={9} />);
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
  });
});
