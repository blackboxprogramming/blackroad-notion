[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/blackboxprogramming/blackroad-notion.svg?style=social&label=Star)](https://github.com/blackboxprogramming/blackroad-notion)
[![GitHub forks](https://img.shields.io/github/forks/blackboxprogramming/blackroad-notion.svg?style=social&label=Fork)](https://github.com/blackboxprogramming/blackroad-notion/fork)


# BlackRoad Notion Integration 📝

Sync your BlackRoad deployments and analytics with Notion!

## Features

- **Bidirectional Sync**
  - Deployments → Notion database
  - Notion pages → BlackRoad deployments

- **Auto-sync**
  - Runs every hour automatically
  - Real-time analytics tracking

- **Analytics Dashboard**
  - 7-day metrics
  - Request counts
  - Uptime tracking
  - Latency monitoring

## Installation

```bash
npm install @notionhq/client axios
```

## Setup

1. Create Notion integration: https://www.notion.so/my-integrations
2. Get your API key
3. Create database for deployments
4. Set environment variables:

```bash
export NOTION_TOKEN="your-token"
export NOTION_DATABASE_ID="your-database-id"
export BLACKROAD_API_KEY="your-api-key"
```

## Usage

```typescript
import { syncDeploymentsToNotion } from './sync'

// Sync deployments to Notion
await syncDeploymentsToNotion()

// Create deployment from Notion page
await createDeploymentFromNotion('page-id')

// Sync analytics
await syncAnalyticsToNotion()
```

## Database Schema

Your Notion database should have these properties:
- Name (Title)
- Status (Select)
- URL (URL)
- Created At (Date)
- Deployment ID (Text)

## License

MIT License

---

Part of the **BlackRoad Empire** 🚀
