import { render, screen } from '@testing-library/react';
import { GameResult } from './GameResult';

describe('GameResult', () => {
  it('renders nothing when result is null', () => {
    const { container } = render(<GameResult result={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows win message when result is win', () => {
    render(<GameResult result="win" />);
    expect(screen.getByText(/you win/i)).toBeInTheDocument();
  });

  it('shows lose message when result is lose', () => {
    render(<GameResult result="lose" />);
    expect(screen.getByText(/you lose/i)).toBeInTheDocument();
  });

  it('shows draw message when result is draw', () => {
    render(<GameResult result="draw" />);
    expect(screen.getByText(/draw/i)).toBeInTheDocument();
  });

  it('includes win emoji for win result', () => {
    render(<GameResult result="win" />);
    expect(screen.getByText(/🎉/)).toBeInTheDocument();
  });

  it('includes lose emoji for lose result', () => {
    render(<GameResult result="lose" />);
    expect(screen.getByText(/😔/)).toBeInTheDocument();
  });

  it('includes draw emoji for draw result', () => {
    render(<GameResult result="draw" />);
    expect(screen.getByText(/🤝/)).toBeInTheDocument();
  });

  it('renders a div element when result is provided', () => {
    const { container } = render(<GameResult result="win" />);
    expect(container.firstChild).not.toBeNull();
  });
});
