import { FlowrippleClient } from '../src/index';

const baseUrl = process.env.FLOWRIPPLE_BASE_URL || 'http://localhost:3000';
const validApiClientId = parseInt(process.env.FLOWRIPPLE_API_CLIENT_ID || '1');
const validApiKey = process.env.FLOWRIPPLE_API_KEY || 'test-api-key';

describe('FlowrippleClient', () => {
  describe('constructor', () => {
    it('should set default baseUrl if not provided', () => {
      const client = new FlowrippleClient({
        apiClientId: validApiClientId,
        apiKey: validApiKey,
      });
      expect(client['baseUrl']).toBe('https://api.flowripple.com');
    });

    it('should use provided baseUrl', () => {
      const client = new FlowrippleClient({
        apiClientId: validApiClientId,
        apiKey: validApiKey,
        baseUrl: 'http://custom.url',
      });
      expect(client['baseUrl']).toBe('http://custom.url');
    });
  });

  describe('capture method', () => {
    describe('success cases', () => {
      it('should successfully capture an event', async () => {
        const client = new FlowrippleClient({
          apiClientId: validApiClientId,
          apiKey: validApiKey,
          baseUrl,
        });

        const eventName = 'test.event';
        const payload = { userId: '123', action: 'test' };

        const result = await client.capture(eventName, payload);
        expect(result).toBeUndefined();
      });

      it('should handle successful capture in silent mode', async () => {
        const client = new FlowrippleClient({
          apiClientId: validApiClientId,
          apiKey: validApiKey,
          baseUrl,
          silent: true,
        });

        const result = await client.capture('test.event', { userId: '123' });
        expect(result).toBeUndefined();
      });
    });

    describe('error cases', () => {
      it('should throw error with descriptive message in normal mode', async () => {
        const client = new FlowrippleClient({
          apiClientId: -1, // Invalid ID to force error
          apiKey: validApiKey,
          baseUrl,
        });

        await expect(client.capture('test.event', {})).rejects.toThrow(
          'Failed to capture event',
        );
      });

      it('should return false in silent mode on error', async () => {
        const client = new FlowrippleClient({
          apiClientId: -1, // Invalid ID to force error
          apiKey: validApiKey,
          baseUrl,
          silent: true,
        });

        const result = await client.capture('test.event', {});
        expect(result).toBe(false);
      });

      it('should handle invalid API responses', async () => {
        const client = new FlowrippleClient({
          apiClientId: validApiClientId,
          apiKey: 'invalid-key', // Invalid key to force error
          baseUrl,
        });

        await expect(client.capture('test.event', {})).rejects.toThrow(
          'Failed to capture event',
        );
      });
    });
  });
});
