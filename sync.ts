import { Client } from "@notionhq/client"
import axios from "axios"

const notion = new Client({ auth: process.env.NOTION_TOKEN })
const BLACKROAD_API_KEY = process.env.BLACKROAD_API_KEY
const DATABASE_ID = process.env.NOTION_DATABASE_ID

// Sync deployments to Notion
export async function syncDeploymentsToNotion() {
  try {
    // Fetch deployments from BlackRoad
    const response = await axios.get('https://api.blackroad.io/v1/deployments', {
      headers: { 'Authorization': `Bearer ${BLACKROAD_API_KEY}` }
    })
    
    const deployments = response.data.deployments
    
    // Create Notion pages for each deployment
    for (const deployment of deployments) {
      await notion.pages.create({
        parent: { database_id: DATABASE_ID },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: deployment.name
                }
              }
            ]
          },
          Status: {
            select: {
              name: deployment.status
            }
          },
          URL: {
            url: deployment.url
          },
          'Created At': {
            date: {
              start: deployment.created_at
            }
          },
          'Deployment ID': {
            rich_text: [
              {
                text: {
                  content: deployment.id
                }
              }
            ]
          }
        }
      })
    }
    
    console.log(`✅ Synced ${deployments.length} deployments to Notion`)
  } catch (error) {
    console.error('❌ Sync failed:', error.message)
  }
}

// Create deployment from Notion
export async function createDeploymentFromNotion(pageId) {
  try {
    // Get page from Notion
    const page = await notion.pages.retrieve({ page_id: pageId })
    
    const name = page.properties.Name.title[0].text.content
    const source = page.properties.Source?.rich_text[0]?.text.content || ''
    
    // Create deployment on BlackRoad
    const response = await axios.post('https://api.blackroad.io/v1/deployments', {
      name,
      source
    }, {
      headers: {
        'Authorization': `Bearer ${BLACKROAD_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })
    
    // Update Notion page with deployment info
    await notion.pages.update({
      page_id: pageId,
      properties: {
        'Status': {
          select: {
            name: response.data.status
          }
        },
        'URL': {
          url: response.data.url
        },
        'Deployment ID': {
          rich_text: [
            {
              text: {
                content: response.data.id
              }
            }
          ]
        }
      }
    })
    
    console.log('✅ Deployment created and synced to Notion')
  } catch (error) {
    console.error('❌ Failed:', error.message)
  }
}

// Sync analytics to Notion
export async function syncAnalyticsToNotion() {
  try {
    const response = await axios.get('https://api.blackroad.io/v1/analytics?range=7d', {
      headers: { 'Authorization': `Bearer ${BLACKROAD_API_KEY}` }
    })
    
    const analytics = response.data
    
    // Create analytics page
    await notion.pages.create({
      parent: { database_id: process.env.NOTION_ANALYTICS_DB },
      properties: {
        Date: {
          date: {
            start: new Date().toISOString()
          }
        },
        Requests: {
          number: analytics.requests
        },
        Uptime: {
          number: parseFloat(analytics.uptime)
        },
        'Avg Latency': {
          number: analytics.latency
        },
        Users: {
          number: analytics.users || 0
        }
      }
    })
    
    console.log('✅ Analytics synced to Notion')
  } catch (error) {
    console.error('❌ Sync failed:', error.message)
  }
}

// Run sync every hour
setInterval(syncDeploymentsToNotion, 3600000)
setInterval(syncAnalyticsToNotion, 3600000)
