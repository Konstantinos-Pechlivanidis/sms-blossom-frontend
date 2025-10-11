# Campaigns Help

## What you can do here

Create and manage SMS marketing campaigns with live preview and audience targeting.

### Key Features
- **4-step campaign wizard**: Guided creation process
- **Live SMS preview**: See exactly what recipients will read
- **Audience targeting**: Use segments to reach the right customers
- **Cost estimation**: Understand pricing based on message length and recipients
- **Scheduling**: Send immediately or schedule for optimal times

### Campaign Creation Process
1. **Details**: Name your campaign and add optional description
2. **Audience**: Select target segment with live customer count
3. **Message**: Write SMS content with live preview and character counting
4. **Discount & Send**: Add optional discount codes and schedule delivery

### Key Backend Endpoints
- `GET /campaigns` - List all campaigns
- `POST /campaigns` - Create new campaign
- `GET /segments` - List available segments
- `POST /campaigns/estimate` - Estimate campaign cost
- `POST /campaigns/{id}/prepare` - Prepare unique discount codes
- `POST /campaigns/{id}/send` - Send campaign

### SMS Best Practices
- **Character limits**: GSM messages (160 chars) vs Unicode (70 chars)
- **Variable usage**: Use {{first_name}}, {{discount_code}} for personalization
- **Timing**: Send during business hours for better engagement
- **Testing**: Always send test messages before full campaign

### Common Pitfalls
- **Message length**: Long messages cost more (multiple segments)
- **Unicode characters**: Emojis and special chars reduce character limit
- **Segment selection**: Empty segments won't send any messages
- **Scheduling**: Double-check send times for different time zones