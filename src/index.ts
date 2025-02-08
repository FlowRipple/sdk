import axios from 'axios';
import crypto from 'crypto';

/**
 * Configuration options for initializing the FlowrippleClient
 */
interface FlowrippleClientOptions {
  /** (Required) Flowripple API Client ID */
  apiClientId: number;
  /** (Required) API key for authentication with Flowripple */
  apiKey: string;
  /** (Optional) Base URL for the Flowripple API. Defaults to https://api.flowripple.com */
  baseUrl?: string;
  /** (Optional) If true, failed API calls will return false instead of throwing errors */
  silent?: boolean;
  /** (Optional) Version of the Flowripple API to use. Defaults to 'v1' */
  version?: 'v1';
}

/**
 * Client for interacting with the Flowripple API
 *
 * @example
 * ```typescript
 * const client = new FlowrippleClient({
 *   apiKey: 'your-api-key'
 * });
 *
 * await client.capture('user.signup', {
 *   userId: '123',
 *   email: 'user@example.com'
 * });
 * ```
 */
export class FlowrippleClient {
  private readonly baseUrl: string;

  /**
   * Creates a new FlowrippleClient instance
   * @param options - Configuration options for the client
   */
  constructor(private readonly options: FlowrippleClientOptions) {
    this.baseUrl = options.baseUrl || 'https://api.flowripple.com';
  }

  /**
   * Captures an event by sending it to the Flowripple API
   * @param eventName - The name of the event to capture
   * @param payload - The payload data associated with the event
   * @returns Promise that resolves to true if the event was successfully captured,
   *          or false if silent mode is enabled and the request failed
   * @throws {Error} If the request fails and silent mode is not enabled
   */
  async capture(eventName: string, payload: object): Promise<false | void> {
    try {
      const body = {
        event: eventName,
        payload,
      };

      const timestamp = Date.now().toString();
      const stringToSign = timestamp + JSON.stringify(body);
      const hmac = crypto
        .createHmac('sha256', this.options.apiKey)
        .update(stringToSign)
        .digest('hex');
      const url = `${this.baseUrl.replace(/^\/+/, '')}/sdk/${this.options.version ?? 'v1'}/capture`;
      await axios.post(url, body, {
        headers: {
          'Content-Type': 'application/json',
          'X-Flowripple-Api-Client-Id': this.options.apiClientId,
          'X-Flowripple-Signature': hmac,
          'X-Flowripple-Timestamp': timestamp,
        },
      });
      return;
    } catch (error) {
      if (this.options.silent) {
        return false;
      }

      throw new Error(
        `Failed to capture event: ${(error as Error)?.message ?? error}`,
      );
    }
  }
}
