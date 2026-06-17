import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AiAssistant from './AiAssistant';

// Mock fetch globally
global.fetch = vi.fn();

describe('AiAssistant', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the chat interface', () => {
    render(<AiAssistant userScore={5.2} breakdown={null} />);
    
    expect(screen.getByText(/EcoTrack AI/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ask about carbon footprint.../i)).toBeInTheDocument();
  });

  it('sends a message and handles the API response', async () => {
    // Setup mock fetch response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ text: 'This is a mock AI response.' }),
    });

    render(<AiAssistant userScore={5.2} breakdown={null} />);
    
    const input = screen.getByPlaceholderText(/Ask about carbon footprint.../i);
    const sendBtn = screen.getByRole('button', { name: /Send Message/i });

    // Type a message
    fireEvent.change(input, { target: { value: 'How can I reduce emissions?' } });
    expect(input).toHaveValue('How can I reduce emissions?');

    // Click send
    fireEvent.click(sendBtn);

    // Ensure the message shows up in chat
    expect(screen.getByText('How can I reduce emissions?')).toBeInTheDocument();

    // Wait for the mock response
    await waitFor(() => {
      expect(screen.getByText('This is a mock AI response.')).toBeInTheDocument();
    });

    // Ensure fetch was called
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('/api/chat', expect.any(Object));
  });

  it('handles API errors gracefully', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
    });

    render(<AiAssistant userScore={5.2} breakdown={null} />);
    
    const input = screen.getByPlaceholderText(/Ask about carbon footprint.../i);
    const sendBtn = screen.getByRole('button', { name: /Send Message/i });

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(screen.getByText(/Oops! I couldn't process that/i)).toBeInTheDocument();
    });
  });
});
