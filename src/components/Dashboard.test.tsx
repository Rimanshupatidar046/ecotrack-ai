import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Dashboard from './Dashboard';
import { CalculationResult } from '../types';

describe('Dashboard Component', () => {
  const mockResult: CalculationResult = {
    carbonScore: 4.5,
    sustainabilityScore: 82,
    impactCategory: 'Good',
    breakdown: {
      transport: 1.2,
      energy: 2.0,
      food: 0.8,
      waste: 0.5
    },
    recommendations: [],
  };

  it('renders the empty state if no result is provided', () => {
    render(<Dashboard result={null} commentary="" />);
    expect(screen.getByText(/No Emissions Profile Active/i)).toBeInTheDocument();
  });

  it('renders the analytics when a result is provided', () => {
    render(<Dashboard result={mockResult} commentary="Great job!" />);
    
    // Check main KPI
    const scores = screen.getAllByText('4.5');
    expect(scores.length).toBeGreaterThan(0);
    expect(screen.getByText('Tons CO₂e/yr')).toBeInTheDocument();
    
    // Check breakdown categories
    expect(screen.getByText(/Transit Networks/i)).toBeInTheDocument();
    expect(screen.getByText(/Thermodynamic Loads/i)).toBeInTheDocument();
    expect(screen.getByText(/Nutrition Cycles/i)).toBeInTheDocument();
    expect(screen.getByText(/Municipal Waste/i)).toBeInTheDocument();
    
    // Check AI Commentary exists
    expect(screen.getByText(/"Great job!"/i)).toBeInTheDocument();
  });
});
