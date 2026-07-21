import { defineConfig } from 'vitest/config';
import TestDriver from 'testdriverai/vitest';

// Dedicated Vitest config for TestDriver end-to-end tests.
// Kept separate from the app's own unit tests (src/**) and scoped to tests/**
// so `pnpm test` (unit tests) and the E2E suite never collide.
// Note: dotenv is loaded automatically by the TestDriver SDK.
export default defineConfig({
  test: {
    include: ['tests/**/*.test.{js,mjs,ts}'],
    testTimeout: 900000,
    hookTimeout: 900000,
    reporters: ['default', TestDriver()],
    setupFiles: ['testdriverai/vitest/setup'],
  },
});
