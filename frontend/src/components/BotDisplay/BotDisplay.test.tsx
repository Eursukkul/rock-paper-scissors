import { render, screen } from '@testing-library/react';
import { BotDisplay } from './BotDisplay';

describe('BotDisplay', () => {
  it('shows "???" when botAction is null', () => {
    render(<BotDisplay botAction={null} />);
    expect(screen.getByText('???')).toBeInTheDocument();
  });

  it('does not show "???" when botAction is provided', () => {
    render(<BotDisplay botAction="rock" />);
    expect(screen.queryByText('???')).not.toBeInTheDocument();
  });

  it('shows ROCK when botAction is rock', () => {
    render(<BotDisplay botAction="rock" />);
    expect(screen.getByText(/ROCK/i)).toBeInTheDocument();
  });

  it('shows PAPER when botAction is paper', () => {
    render(<BotDisplay botAction="paper" />);
    expect(screen.getByText(/PAPER/i)).toBeInTheDocument();
  });

  it('shows SCISSORS when botAction is scissors', () => {
    render(<BotDisplay botAction="scissors" />);
    expect(screen.getByText(/SCISSORS/i)).toBeInTheDocument();
  });

  it('shows the Bot action label', () => {
    render(<BotDisplay botAction={null} />);
    expect(screen.getByText(/bot action/i)).toBeInTheDocument();
  });

  it('shows the correct emoji for rock', () => {
    render(<BotDisplay botAction="rock" />);
    expect(screen.getByText(/✊/)).toBeInTheDocument();
  });

  it('shows the correct emoji for paper', () => {
    render(<BotDisplay botAction="paper" />);
    expect(screen.getByText(/✋/)).toBeInTheDocument();
  });

  it('shows the correct emoji for scissors', () => {
    render(<BotDisplay botAction="scissors" />);
    expect(screen.getByText(/✌️/)).toBeInTheDocument();
  });
});
