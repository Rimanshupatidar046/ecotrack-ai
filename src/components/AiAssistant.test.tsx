import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AiAssistant from './AiAssistant';
import { CalculationResult } from '../types';

// Mock fetch globally
global.fetch = vi.fn();

const mockScore: CalculationResult = {
  carbonScore: 5.2,
  sustainabilityScore: 70,
  impactCategory: 'Average',
  breakdown: { transport: 1, energy: 2, food: 1, waste: 1.2 },
  recommendations: []
};

describe('AiAssistant', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the chat interface', () => {
    render(<AiAssistant scoreResult={mockScore} />);
    
    expect(screen.getByText(/EcoTrack AI Companion/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ask local carbon advisor.../i)).toBeInTheDocument();
  });

  it('sends a message and handles the API response', async () => {
    // Setup mock fetch response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ text: 'This is a mock AI response.' }),
    });

    render(<AiAssistant scoreResult={mockScore} />);
    
    const input = screen.getByPlaceholderText(/Ask local carbon advisor.../i);
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
    expect(global.fetch).toHaveBeenCalledWith('/api/ai/chat', expect.any(Object));
  });

  it('handles API errors gracefully', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    render(<AiAssistant scoreResult={mockScore} />);
    
    const input = screen.getByPlaceholderText(/Ask local carbon advisor.../i);
    const sendBtn = screen.getByRole('button', { name: /Send Message/i });

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(screen.getByText(/I apologize, I encountered a brief telemetry offline/i)).toBeInTheDocument();
    });
  });
});
