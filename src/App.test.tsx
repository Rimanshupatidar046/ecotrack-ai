import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock ThreeEarth since WebGL is hard to test in JSDOM
vi.mock('./components/ThreeEarth', () => ({
  default: () => <div data-testid="three-earth-mock" />
}));

describe('App Layout and Navigation', () => {
  it('renders the header and navigation correctly', () => {
    render(<App />);
    
    // Verify Header exists
    expect(screen.getByRole('banner')).toBeInTheDocument();
    
    // Check navigation items
    const tabs = ['Workspace', 'Footprint Calculator', 'Action Hub', 'Eco Assistant'];
    tabs.forEach(tab => {
      expect(screen.getByText(tab)).toBeInTheDocument();
    });
  });

  it('can navigate between different tabs', () => {
    render(<App />);
    
    // Default tab is Dashboard
    expect(screen.getByText(/Carbon Analytics Dashboard/i)).toBeInTheDocument();
    
    // Click on Calculator tab
    const calcTab = screen.getByText('Footprint Calculator');
    fireEvent.click(calcTab);
    
    // Calculator view should now be active
    expect(screen.getByText(/Lifestyle Carbon Assessment/i)).toBeInTheDocument();
  });
});
