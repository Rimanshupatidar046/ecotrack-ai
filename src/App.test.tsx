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
    const activeChallenge = await screen.findByText(/Active Eco Challenges & Missions/i);
    expect(activeChallenge).toBeInTheDocument();

    // Click on Roadmap tab (Reduction Roadmap)
    const roadmapTab = screen.getByText('Reduction Roadmap');
    fireEvent.click(roadmapTab);
    const roadmapTitle = await screen.findByText(/Carbon Reduction Roadmap Milestones/i);
    expect(roadmapTitle).toBeInTheDocument();

    // Click on Report tab (Download ESG Reports)
    const reportTab = screen.getByText('Download ESG Reports');
    fireEvent.click(reportTab);
    // Requires scoreResult, so we just verify we can click it without crashing

    // Click on Recommendations tab (Commit Solutions)
    const recTab = screen.getByText('Commit Solutions');
    fireEvent.click(recTab);

    // Click on Dashboard tab (Analytics Dashboard)
    const dashTab = screen.getByText('Analytics Dashboard');
    fireEvent.click(dashTab);

    // Click on AI Chatbot
    const chatTab = screen.getByText('AI Chatbot Assistant');
    fireEvent.click(chatTab);
    // Requires scoreResult, so we just verify we can click it without crashing
  });
});
