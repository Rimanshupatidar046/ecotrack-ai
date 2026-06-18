import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CarbonCalculator from './CarbonCalculator';

describe('Carbon Calculator', () => {
  const mockOnComplete = vi.fn();

  it('renders all form steps correctly', () => {
    const setMock = vi.fn();
    render(<CarbonCalculator onCalculationComplete={mockOnComplete} isLoading={false} setIsLoading={setMock} />);
    
    // Step 1 should be visible initially (Transportation)
    expect(screen.getAllByText(/Transportation/i).length).toBeGreaterThan(0);
  });

  it('can progress through the steps, change inputs, and submit', async () => {
    // Mock fetch for submission
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        carbonScore: 2.5,
        sustainabilityScore: 90,
        impactCategory: 'Excellent',
        breakdown: { transport: 0.5, energy: 1.0, food: 0.5, waste: 0.5 },
        recommendations: [],
        commentary: 'Test mock'
      })
    }) as unknown as typeof fetch;

    const setMock = vi.fn();
    render(<CarbonCalculator onCalculationComplete={mockOnComplete} isLoading={false} setIsLoading={setMock} />);
    
    // Step 1: Transport -> Change input and click Next
    const carInput = screen.getByLabelText('Car Travel Distance');
    fireEvent.change(carInput, { target: { value: '20' } });
    const nextButton1 = screen.getByText('Next Parameter');
    fireEvent.click(nextButton1);
    
    // Step 2: Energy -> Click Next
    expect(screen.getByText(/Home Energy/i)).toBeInTheDocument();
    const nextButton2 = screen.getByText('Next Parameter');
    fireEvent.click(nextButton2);
    
    // Step 3: Diet & Food -> Click Next
    expect(screen.getByText(/Diet habits/i)).toBeInTheDocument();
    const nextButton3 = screen.getByText('Next Parameter');
    fireEvent.click(nextButton3);
    
    // Step 4: Waste -> Click Calculate
    expect(screen.getByText(/Circular waste/i)).toBeInTheDocument();
    const submitBtn = screen.getByText('Calculate Carbon Profile');
    fireEvent.click(submitBtn);

    // After clicking, it should call setIsLoading(true)
    await waitFor(() => {
      expect(setMock).toHaveBeenCalledWith(true);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });
});
