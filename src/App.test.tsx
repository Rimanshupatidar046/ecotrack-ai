import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
    
    // The top nav has 'Platform Home' and 'Explore Workspace'
    expect(screen.getByText('Platform Home')).toBeInTheDocument();
    expect(screen.getByText('Explore Workspace')).toBeInTheDocument();
  });

  it('can navigate between different tabs', async () => {
    render(<App />);
    
    // Landing page is default, click Explore Workspace to enter App
    const exploreBtn = screen.getByText('Explore Workspace');
    fireEvent.click(exploreBtn);
    
    // Carbon Assessment should be visible (using findByText for lazy loaded)
    const carbonTabs = await screen.findAllByText(/Carbon Assessment/i);
    expect(carbonTabs.length).toBeGreaterThan(0);
    
    // Check navigation items inside Workspace
    const tabs = ['Carbon Assessment', 'Analytics Dashboard', 'Commit Solutions', 'Eco Missions', 'Reduction Roadmap', 'AI Chatbot Assistant', 'Download ESG Reports'];
    tabs.forEach(tab => {
      expect(screen.getByRole('button', { name: new RegExp(tab, 'i') }) || screen.getByText(new RegExp(tab, 'i'))).toBeInTheDocument();
    });

    // Click on Gamification tab (Eco Missions)
    const gamificationTab = screen.getByText('Eco Missions');
    fireEvent.click(gamificationTab);
    
    // Gamification view should now be active (shows points etc)
    const activeChallenge = await screen.findByText(/Active Eco Challenges & Missions/i);
    expect(activeChallenge).toBeInTheDocument();
  });
});
