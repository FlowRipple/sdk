import { FlowrippleClient } from '../src/index';
import axios from 'axios';

const baseUrl = process.env.FLOWRIPPLE_BASE_URL || 'http://localhost:3000';
const validApiClientId = parseInt(process.env.FLOWRIPPLE_API_CLIENT_ID || '1');
const validApiKey = process.env.FLOWRIPPLE_API_KEY || 'test-api-key';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('FlowrippleClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
      beforeEach(() => {
        mockedAxios.post.mockResolvedValue({ data: {} });
      });

      it('should send correct request payload and headers', async () => {
        const client = new FlowrippleClient({
          apiClientId: validApiClientId,
          apiKey: validApiKey,
          baseUrl,
        });

        const eventName = 'test.event';
        const payload = { userId: '123', action: 'test' };

        await client.capture(eventName, payload);

        expect(mockedAxios.post).toHaveBeenCalledTimes(1);
        const [url, body, config] = mockedAxios.post.mock.calls[0] ?? [];

        expect(url).toBe(`${baseUrl}/sdk/v1/capture`);
        expect(body).toEqual({ event: eventName, payload });
        expect(config?.headers).toMatchObject({
          'Content-Type': 'application/json',
          'X-Flowripple-Api-Client-Id': validApiClientId,
          'X-Flowripple-Signature': expect.any(String),
          'X-Flowripple-Timestamp': expect.any(String),
        });
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
      beforeEach(() => {
        mockedAxios.post.mockRejectedValue(new Error('Network error'));
      });

      it('should throw error with descriptive message in normal mode', async () => {
        const client = new FlowrippleClient({
          apiClientId: validApiClientId,
          apiKey: validApiKey,
          baseUrl,
        });

        await expect(client.capture('test.event', {})).rejects.toThrow(
          'Failed to capture event: Network error',
        );
      });

      it('should return false in silent mode on error', async () => {
        const client = new FlowrippleClient({
          apiClientId: validApiClientId,
          apiKey: validApiKey,
          baseUrl,
          silent: true,
        });

        const result = await client.capture('test.event', {});
        expect(result).toBe(false);
      });

      it('should handle malformed API responses', async () => {
        mockedAxios.post.mockRejectedValue({
          isAxiosError: true,
          response: {
            status: 400,
            data: { message: 'Invalid payload' },
          },
        });

        const client = new FlowrippleClient({
          apiClientId: validApiClientId,
          apiKey: validApiKey,
          baseUrl,
        });

        await expect(client.capture('test.event', {})).rejects.toThrow(
          'Failed to capture event',
        );
      });
    });
  });
});
