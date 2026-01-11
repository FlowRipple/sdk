import axios from 'axios';

/**
 * Configuration options for initializing the FlowrippleClient
 */
interface FlowrippleClientOptions {
  /** (Required) API key for authentication with Flowripple (starts with frp_) */
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
 *   apiKey: 'frp_your-api-key'
 * });
 *
 * await client.trigger('user.signup', {
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
   * Triggers a workflow by sending an event to the Flowripple API
   * @param identifier - The event identifier to trigger
   * @param data - Optional data payload associated with the event
   * @returns Promise that resolves to void on success,
   *          or false if silent mode is enabled and the request failed
   * @throws {Error} If the request fails and silent mode is not enabled
   */
  async trigger(
    identifier: string,
    data?: Record<string, any>,
  ): Promise<false | void> {
    try {
      const body = {
        identifier,
        data: data || {},
      };

      const url = `${this.baseUrl.replace(/\/+$/, '')}/api/${this.options.version ?? 'v1'}/trigger`;
      await axios.post(url, body, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.options.apiKey,
        },
      });
      return;
    } catch (error) {
      if (this.options.silent) {
        return false;
      }

      throw new Error(
        `Failed to trigger event: ${(error as Error)?.message ?? error}`,
      );
    }
  }
}
