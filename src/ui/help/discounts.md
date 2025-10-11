# Discounts Help

## What you can do here

Create and manage discount codes for your SMS marketing campaigns.

### Key Features
- **Discount creation**: Generate unique or shared discount codes
- **Shopify integration**: Sync with your Shopify store
- **Code generation**: Bulk create unique codes for campaigns
- **Usage tracking**: Monitor redemption rates and performance
- **Expiration management**: Set automatic expiry dates

### Key Backend Endpoints
- `GET /discounts` - List all discount codes
- `POST /discounts` - Create new discount
- `POST /discounts/generate` - Generate unique codes
- `GET /discounts/{id}/usage` - Check usage statistics
- `PUT /discounts/{id}` - Update discount settings

### Discount Types
- **Shared codes**: Same code for all recipients (e.g., "SAVE20")
- **Unique codes**: Individual codes per recipient (e.g., "SAVE20-JOHN123")
- **Percentage discounts**: 10%, 20%, 50% off
- **Fixed amount**: $5, $10, $25 off
- **Free shipping**: Waive shipping costs

### Best Practices
- **Code clarity**: Use memorable, brand-related codes
- **Expiration dates**: Set reasonable time limits to create urgency
- **Usage limits**: Prevent abuse with per-customer limits
- **Testing**: Always test codes before sending campaigns

### Common Pitfalls
- **Code conflicts**: Avoid duplicate codes across campaigns
- **Expiration timing**: Set appropriate expiry windows
- **Usage tracking**: Monitor for unusual redemption patterns
- **Shopify sync**: Ensure discount codes are properly created in Shopify
