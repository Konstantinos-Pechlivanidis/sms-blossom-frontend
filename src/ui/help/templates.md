# Templates Help

## What you can do here

Create and manage reusable SMS message templates for your campaigns.

### Key Features
- **Template library**: Save and reuse common message formats
- **Variable support**: Use dynamic content with LiquidJS variables
- **Preview system**: Test templates before sending
- **Version control**: Track template changes and updates
- **Import/Export**: Share templates across campaigns

### Key Backend Endpoints
- `GET /templates` - List all templates
- `POST /templates` - Create new template
- `PUT /templates/{id}` - Update template
- `DELETE /templates/{id}` - Remove template
- `POST /templates/validate` - Validate template syntax

### Template Variables
- **Customer data**: {{first_name}}, {{last_name}}, {{email}}
- **Order data**: {{order_number}}, {{total_amount}}, {{items}}
- **Discount data**: {{discount_code}}, {{discount_amount}}
- **Store data**: {{shop_name}}, {{shop_url}}
- **Custom fields**: {{custom_field_name}}

### Template Best Practices
- **Clear messaging**: Keep messages concise and actionable
- **Call-to-action**: Include clear next steps for recipients
- **Personalization**: Use customer names and relevant data
- **Testing**: Always preview with sample data before sending
- **Compliance**: Include opt-out instructions where required

### Common Pitfalls
- **Variable syntax**: Use correct {{variable}} format
- **Character limits**: Monitor GSM vs Unicode character usage
- **Missing variables**: Ensure all variables have fallback values
- **Template conflicts**: Avoid duplicate template names
