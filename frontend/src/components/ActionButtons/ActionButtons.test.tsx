import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ActionButtons } from './ActionButtons';

describe('ActionButtons', () => {
  const defaultProps = {
    disabled: false,
    onAction: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all three action buttons', () => {
    render(<ActionButtons {...defaultProps} />);
    expect(screen.getByRole('button', { name: /rock/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /paper/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /scissors/i })).toBeInTheDocument();
  });

  it('buttons are enabled when disabled prop is false', () => {
    render(<ActionButtons {...defaultProps} disabled={false} />);
    expect(screen.getByRole('button', { name: /rock/i })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: /paper/i })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: /scissors/i })).not.toBeDisabled();
  });

  it('buttons are disabled when disabled prop is true', () => {
    render(<ActionButtons {...defaultProps} disabled={true} />);
    expect(screen.getByRole('button', { name: /rock/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /paper/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /scissors/i })).toBeDisabled();
  });

  it('calls onAction with "rock" when rock button is clicked', async () => {
    const onAction = jest.fn();
    render(<ActionButtons {...defaultProps} onAction={onAction} />);
    await userEvent.click(screen.getByRole('button', { name: /rock/i }));
    expect(onAction).toHaveBeenCalledWith('rock');
  });

  it('calls onAction with "paper" when paper button is clicked', async () => {
    const onAction = jest.fn();
    render(<ActionButtons {...defaultProps} onAction={onAction} />);
    await userEvent.click(screen.getByRole('button', { name: /paper/i }));
    expect(onAction).toHaveBeenCalledWith('paper');
  });

  it('calls onAction with "scissors" when scissors button is clicked', async () => {
    const onAction = jest.fn();
    render(<ActionButtons {...defaultProps} onAction={onAction} />);
    await userEvent.click(screen.getByRole('button', { name: /scissors/i }));
    expect(onAction).toHaveBeenCalledWith('scissors');
  });

  it('does not call onAction when buttons are disabled', async () => {
    const onAction = jest.fn();
    render(<ActionButtons {...defaultProps} disabled={true} onAction={onAction} />);
    await userEvent.click(screen.getByRole('button', { name: /rock/i }));
    expect(onAction).not.toHaveBeenCalled();
  });

  it('shows the Your action label', () => {
    render(<ActionButtons {...defaultProps} />);
    expect(screen.getByText(/your action/i)).toBeInTheDocument();
  });
});
