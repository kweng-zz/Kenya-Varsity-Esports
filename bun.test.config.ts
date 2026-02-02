import { expect } from 'bun:test';
import * as matchers from '@testing-library/jest-dom/matchers';
import { GlobalRegistrator } from '@happy-dom/global-registrator';

// Register happy-dom for browser-like environment
GlobalRegistrator.register();

// Extend expect with jest-dom matchers
expect.extend(matchers);

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
} as any;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: any) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
