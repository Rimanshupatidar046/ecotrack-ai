import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CarbonCalculator from './CarbonCalculator';

describe('Carbon Calculator', () => {
  const mockOnComplete = vi.fn();

  it('renders all form steps correctly', () => {
    render(<CarbonCalculator onComplete={mockOnComplete} isFullPage={true} />);
    
    // Step 1 should be visible initially (Transportation)
    expect(screen.getByText(/Transportation/i)).toBeInTheDocument();
    
    // Test that the form starts properly
    expect(screen.getByText('Private Vehicle Usage')).toBeInTheDocument();
  });

  it('can progress through the steps and submit', async () => {
    render(<CarbonCalculator onComplete={mockOnComplete} isFullPage={true} />);
    
    // Step 1: Transport -> Click Next
    const nextButton1 = screen.getByText('Next Step');
    fireEvent.click(nextButton1);
    
    // Step 2: Energy -> Click Next
    expect(screen.getByText(/Energy & Housing/i)).toBeInTheDocument();
    const nextButton2 = screen.getByText('Next Step');
    fireEvent.click(nextButton2);
    
    // Step 3: Diet & Food -> Click Next
    expect(screen.getByText(/Diet & Consumption/i)).toBeInTheDocument();
    const nextButton3 = screen.getByText('Next Step');
    fireEvent.click(nextButton3);
    
    // Step 4: Waste -> Click Calculate
    expect(screen.getByText(/Waste & Recycling/i)).toBeInTheDocument();
    const submitBtn = screen.getByText('Calculate Carbon Profile');
    fireEvent.click(submitBtn);

    // After loading, the mock should be called
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalled();
    }, { timeout: 3000 });
  });
});
