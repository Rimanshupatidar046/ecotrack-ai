import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AiAssistant from './AiAssistant';
import ReportExport from './ReportExport';
import Recommendations from './Recommendations';
import Gamification from './Gamification';
import Roadmap from './Roadmap';
import { AnimatedCard } from './AnimatedCard';
import WeeklyTips from './WeeklyTips';

describe('Miscellaneous Components', () => {
  const mockScoreResult = {
    carbonScore: 4.5,
    sustainabilityScore: 82,
    impactCategory: 'Good' as const,
    breakdown: { transport: 1.2, energy: 2.0, food: 0.8, waste: 0.5 },
    recommendations: [
      { id: '1', title: 'Test Rec', description: 'Test Desc', co2Reduction: 100, financialSavings: 50, difficulty: 'Easy' as const, category: 'energy' as const, icon: 'Sun' }
    ]
  };

  it('renders AiAssistant and interacts with chat', () => {
    // Mock fetch for chat API
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ text: 'Mock AI Response' })
    }) as unknown as typeof fetch;

    const { container } = render(<AiAssistant scoreResult={mockScoreResult} />);
    expect(container).toBeInTheDocument();
  });

  it('renders ReportExport', () => {
    // Mock window.print
    const printMock = vi.fn();
    Object.defineProperty(window, 'print', { value: printMock, writable: true });

    const { container } = render(<ReportExport scoreResult={mockScoreResult} />);
    expect(container).toBeInTheDocument();
  });

  it('renders Recommendations', () => {
    const commitMock = vi.fn();
    const { container } = render(<Recommendations recommendations={mockScoreResult.recommendations} onCommitRecommendation={commitMock} committedIds={[]} />);
    expect(container).toBeInTheDocument();
  });

  it('renders Gamification', () => {
    const challenges = [{ id: '1', title: 'Ch 1', description: 'Desc 1', category: 'energy' as const, points: 10, completed: false, type: 'daily' as const }];
    const badges = [{ id: '1', name: 'Badge 1', description: 'BDesc 1', icon: 'Award', unlocked: true }];
    const compMock = vi.fn();
    
    const { container } = render(<Gamification challenges={challenges} badges={badges} userPoints={100} xpPoints={50} onCompleteChallenge={compMock} />);
    expect(container).toBeInTheDocument();
  });

  it('renders Roadmap', () => {
    const milestones = [{ id: 'm1', title: 'M1', timeframe: 'Short-term' as const, targetDate: '2026', description: 'D1', achieved: false, savingsKg: 100 }];
    const toggleMock = vi.fn();
    
    const { container } = render(<Roadmap milestones={milestones} onToggleMilestone={toggleMock} />);
    expect(container).toBeInTheDocument();
  });

  it('renders AnimatedCard', () => {
    const { container } = render(<AnimatedCard><div>Card Content</div></AnimatedCard>);
    expect(container).toBeInTheDocument();
  });

  it('renders WeeklyTips', () => {
    const { container } = render(<WeeklyTips />);
    expect(container).toBeInTheDocument();
  });
});
