import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LandingPage from './LandingPage';

describe('LandingPage (Hero & Footer)', () => {
  it('renders the hero section correctly', () => {
    const onEnterMock = vi.fn();
    render(<LandingPage onEnter={onEnterMock} />);
    
    // Verify main headings exist
    expect(screen.getByText(/Precision Climate Intelligence/i)).toBeInTheDocument();
    expect(screen.getByText(/Calculate, Offset & Eliminate/i)).toBeInTheDocument();
  });

  it('fires the onEnter callback when CTA is clicked', () => {
    const onEnterMock = vi.fn();
    render(<LandingPage onEnter={onEnterMock} />);
    
    // Click the main CTA button
    const ctaButton = screen.getByText('Launch ESG Workspace');
    fireEvent.click(ctaButton);
    
    expect(onEnterMock).toHaveBeenCalledTimes(1);
  });

  it('renders the footer with newsletter signup', () => {
    render(<LandingPage onEnter={() => {}} />);
    
    // Verify footer text
    expect(screen.getByText(/Subscribe to our climate intelligence newsletter/i)).toBeInTheDocument();
    
    // Verify Newsletter input
    const newsletterInput = screen.getByPlaceholderText('Enter your email');
    expect(newsletterInput).toBeInTheDocument();
  });
});
