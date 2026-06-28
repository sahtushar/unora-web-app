/**
 * Simulates variable network latency so skeleton states are visible during development.
 * Tune for demos vs. snappy local dev.
 */
const MOCK_API_BASE_MS = 580;
const MOCK_API_JITTER_MS = 420;

export function getMockApiDelayMs(): number {
  return MOCK_API_BASE_MS + Math.floor(Math.random() * MOCK_API_JITTER_MS);
}

export function mockApiDelay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, getMockApiDelayMs()));
}
