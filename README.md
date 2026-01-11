# @flowripple/sdk

The official Node.js SDK for Flowripple - a visual workflow automation platform.

## Installation

Install the package using npm:

```bash
npm install @flowripple/sdk
```

Or using yarn:

```bash
yarn add @flowripple/sdk
```

Or using pnpm:

```bash
pnpm add @flowripple/sdk
```

## Usage

First, import and initialize the FlowrippleClient with your API key:

```typescript
import { FlowrippleClient } from '@flowripple/sdk';

const client = new FlowrippleClient({
  apiKey: 'frp_your-api-key'
});
```

Then use the client to trigger workflow events:

```typescript
// Trigger a simple event
await client.trigger('user.signup', {
  userId: '123',
  email: 'user@example.com'
});

// Trigger an event with custom data
await client.trigger('order.completed', {
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
| `apiKey` | string | Yes | - | Your Flowripple API Key (starts with `frp_`) |
| `baseUrl` | string | No | 'https://api.flowripple.com' | Custom API base URL |
| `silent` | boolean | No | false | If true, failed API calls return false instead of throwing errors |

#### Methods

##### `trigger(identifier: string, data?: Record<string, any>): Promise<false | void>`

Triggers a workflow by sending an event to the Flowripple API.

- `identifier`: The event identifier to trigger (e.g., 'user.signup', 'order.completed')
- `data`: Optional object containing the event data
- Returns: A promise that resolves to `void` on success, or `false` if the request fails and silent mode is enabled
- Throws: An error if the request fails and silent mode is not enabled

## Error Handling

By default, the SDK will throw errors when API requests fail. You can enable silent mode to return `false` instead:

```typescript
const client = new FlowrippleClient({
  apiKey: 'frp_your-api-key',
  silent: true
});

// This will return false instead of throwing if the request fails
const result = await client.trigger('user.signup', { userId: '123' });
if (result === false) {
  console.log('Event trigger failed');
}
```

## License

MIT
