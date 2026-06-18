import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserverMock;

// Mock PointerEvent
class PointerEventMock extends Event {
  pointerId = 1;
  constructor(type: string, params: any = {}) {
    super(type, params);
  }
}
window.PointerEvent = PointerEventMock as any;

// Mock window.scrollTo
window.scrollTo = vi.fn();

// Mock three.js WebGL rendering for testing
vi.mock('three', async () => {
  const actual = await vi.importActual('three') as any;
  return {
    ...actual,
    WebGLRenderer: vi.fn().mockImplementation(() => ({
      setSize: vi.fn(),
      render: vi.fn(),
      setPixelRatio: vi.fn(),
      dispose: vi.fn(),
      domElement: document.createElement('canvas')
    }))
  };
});
