## What you can do here

Set up automated SMS messages triggered by specific customer actions or events.

### Key Features
- **Event-based Triggers**: Send messages based on events like "Order Placed", "Cart Abandoned"
- **Delay & Cooldowns**: Configure delays and prevent message spamming
- **Personalization**: Use template variables for dynamic content
- **Enable/Disable**: Control the active state of your automations

### Backend Endpoints
- `GET /automations` - List all automations
- `POST /automations` - Create a new automation
- `PUT /automations/:id` - Update an automation
- `DELETE /automations/:id` - Delete an automation