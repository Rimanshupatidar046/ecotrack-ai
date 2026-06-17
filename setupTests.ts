import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup DOM after each test
afterEach(() => {
  cleanup();
});

// Mock ResizeObserver which is needed for Recharts
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock window.matchMedia
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

// Mock ThreeJS WebGLRenderer to avoid JSDOM canvas crashes
vi.mock('three', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual as any,
    WebGLRenderer: vi.fn().mockImplementation(() => ({
      setSize: vi.fn(),
      setPixelRatio: vi.fn(),
      render: vi.fn(),
      dispose: vi.fn(),
      domElement: document.createElement('canvas'),
    }))
  };
});

// Mock HTMLCanvasElement.getContext for Recharts/Three
HTMLCanvasElement.prototype.getContext = vi.fn();
