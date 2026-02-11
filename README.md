# lunchmoney-mcp-v2

A Model Context Protocol (MCP) server for [Lunch Money](https://lunchmoney.app) personal finance management, powered by the [`@lunch-money/lunch-money-js-v2`](https://github.com/lunch-money/lunch-money-js-v2) TypeScript client.

## Overview

This MCP server exposes Lunch Money's v2 API as tools for AI assistants (Claude Desktop, GitHub Copilot, VS Code, etc.). Ask your AI to manage transactions, check budgets, organize categories, and more — all through natural language.

## Setup

### Prerequisites

- Node.js >= 18
- A [Lunch Money API token](https://my.lunchmoney.app/developers)

### Install

```bash
pnpm install
pnpm build
```

### Configure

Set your API token as an environment variable:

```bash
export LUNCHMONEY_API_TOKEN=your_token_here
```

### Usage with Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "lunchmoney": {
      "command": "node",
      "args": ["/path/to/lunchmoney-mcp-v2/build/index.js"],
      "env": {
        "LUNCHMONEY_API_TOKEN": "your_token_here"
      }
    }
  }
}
```

### Usage with GitHub Copilot CLI

Add to your Copilot CLI MCP config:

```json
{
  "mcpServers": {
    "lunchmoney": {
      "command": "node",
      "args": ["/path/to/lunchmoney-mcp-v2/build/index.js"],
      "env": {
        "LUNCHMONEY_API_TOKEN": "your_token_here"
      }
    }
  }
}
```

## Tools (40 total)

| Resource | Tools | Description |
|----------|-------|-------------|
| **User** | 1 | Get current user info |
| **Categories** | 5 | Full CRUD for spending categories |
| **Transactions** | 14 | CRUD, bulk ops, split/group, attachments |
| **Manual Accounts** | 5 | Full CRUD for manually-tracked accounts |
| **Plaid Accounts** | 3 | List, get, and trigger Plaid sync |
| **Tags** | 5 | Full CRUD for tags |
| **Recurring Items** | 2 | List and get recurring expenses |
| **Summary** | 1 | Budget summary |

## License

MIT
