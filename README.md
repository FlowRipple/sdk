# @flowripple/sdk

The official Node.js SDK for Flowripple - a powerful event tracking and analytics platform.

## Installation

Install the package using npm:

```bash
npm install @flowripple/sdk
```

Or using yarn:

```bash
yarn add @flowripple/sdk
```

## Usage

First, import and initialize the FlowrippleClient with your API credentials:

```typescript
import { FlowrippleClient } from '@flowripple/sdk';

const client = new FlowrippleClient({
  apiClientId: YOUR_CLIENT_ID,
  apiKey: 'YOUR_API_KEY'
});
```

Then use the client to capture events:

```typescript
// Capture a simple event
await client.capture('user.signup', {
  userId: '123',
  email: 'user@example.com'
});

// Capture an event with custom properties
await client.capture('order.completed', {
  orderId: 'ord_123',
  amount: 99.99,
  currency: 'USD',
  items: [
    { id: 'prod_1', name: 'T-Shirt', quantity: 2 }
  ]
});
```

## API Reference

### FlowrippleClient

#### Constructor Options

The `FlowrippleClient` constructor accepts a configuration object with the following properties:

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `apiClientId` | number | Yes | - | Your Flowripple API Client ID |
| `apiKey` | string | Yes | - | Your Flowripple API Key |
| `baseUrl` | string | No | 'https://api.flowripple.com' | Custom API base URL |
| `silent` | boolean | No | false | If true, failed API calls return false instead of throwing errors |
| `version` | 'v1' | No | 'v1' | API version to use |

#### Methods

##### `capture(eventName: string, payload: object): Promise<false | void>`

Captures an event by sending it to the Flowripple API.

- `eventName`: The name of the event to capture
- `payload`: An object containing the event data
- Returns: A promise that resolves to `void` on success, or `false` if the request fails and silent mode is enabled
- Throws: An error if the request fails and silent mode is not enabled

## Error Handling

By default, the SDK will throw errors when API requests fail. You can enable silent mode to return `false` instead:

```typescript
const client = new FlowrippleClient({
  apiClientId: YOUR_CLIENT_ID,
  apiKey: 'YOUR_API_KEY',
  silent: true
});

// This will return false instead of throwing if the request fails
const result = await client.capture('user.signup', { userId: '123' });
if (result === false) {
  console.log('Event capture failed');
}
```

## License

MIT
