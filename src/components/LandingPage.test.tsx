import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LandingPage from './LandingPage';

describe('LandingPage (Hero & Footer)', () => {
  it('renders the hero section correctly', () => {
    const onStartCalcMock = vi.fn();
    const onExploreMock = vi.fn();
    render(<LandingPage onStartCalculator={onStartCalcMock} onExploreDashboard={onExploreMock} calculatorTaken={false} />);
    
    // Verify main headings exist
    expect(screen.getByText(/NEXT GENERATION CARBON INTELLIGENCE/i)).toBeInTheDocument();
    expect(screen.getByText(/Track Your Carbon Footprint./i)).toBeInTheDocument();
  });

  it('fires the onStartCalculator callback when CTA is clicked', () => {
    const onStartCalcMock = vi.fn();
    const onExploreMock = vi.fn();
    render(<LandingPage onStartCalculator={onStartCalcMock} onExploreDashboard={onExploreMock} calculatorTaken={false} />);
    
    // Click the main CTA button
    const ctaButton = screen.getByText('Calculate My Footprint');
    fireEvent.click(ctaButton);
    
    expect(onStartCalcMock).toHaveBeenCalledTimes(1);
  });

  it('fires the onExploreDashboard callback when explore CTA is clicked', () => {
    const onStartCalcMock = vi.fn();
    const onExploreMock = vi.fn();
    render(<LandingPage onStartCalculator={onStartCalcMock} onExploreDashboard={onExploreMock} calculatorTaken={true} />);
    
    // Click the explore button
    const ctaButton = screen.getByText('Explore Dashboard');
    fireEvent.click(ctaButton);
    
    expect(onExploreMock).toHaveBeenCalledTimes(1);
  });

  it('renders the footer with newsletter signup', () => {
    const onStartCalcMock = vi.fn();
    const onExploreMock = vi.fn();
    render(<LandingPage onStartCalculator={onStartCalcMock} onExploreDashboard={onExploreMock} calculatorTaken={false} />);
    
    // Verify footer text
    expect(screen.getByText(/Join 34,000\+ citizens receiving weekly climate optimization tips/i)).toBeInTheDocument();
    
    // Verify Newsletter input
    const newsletterInput = screen.getByPlaceholderText('Enter your email');
    expect(newsletterInput).toBeInTheDocument();
  });
});
