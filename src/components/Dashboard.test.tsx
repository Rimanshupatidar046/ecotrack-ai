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
    aiCommentary: 'Great job!',
  };

  it('renders the empty state if no result is provided', () => {
    render(<Dashboard result={null} />);
    expect(screen.getByText(/You haven't completed your baseline assessment yet/i)).toBeInTheDocument();
  });

  it('renders the analytics when a result is provided', () => {
    render(<Dashboard result={mockResult} />);
    
    // Check main KPI
    const scores = screen.getAllByText('4.5');
    expect(scores.length).toBeGreaterThan(0);
    expect(screen.getByText('Tons CO2e / yr')).toBeInTheDocument();
    
    // Check breakdown categories
    expect(screen.getByText('Transit Networks')).toBeInTheDocument();
    expect(screen.getByText('Domestic Energy')).toBeInTheDocument();
    expect(screen.getByText('Nutrition')).toBeInTheDocument();
    expect(screen.getByText('Waste')).toBeInTheDocument();
    
    // Check AI Commentary exists
    expect(screen.getByText('Great job!')).toBeInTheDocument();
  });
});
