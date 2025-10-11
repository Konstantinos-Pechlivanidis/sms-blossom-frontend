# Contacts Help

## What you can do here

Manage your SMS subscriber list and customer contact details.

### Key Features
- **Contact management**: Add, edit, and organize customer contacts
- **Customer sync**: Import customers directly from Shopify
- **CSV import**: Bulk import contacts from spreadsheet files
- **Filtering**: Find contacts by various criteria
- **Bulk actions**: Manage multiple contacts at once

### Key Backend Endpoints
- `GET /contacts` - List all contacts with filtering
- `POST /contacts` - Create new contact
- `PUT /contacts/{id}` - Update contact details
- `DELETE /contacts/{id}` - Remove contact
- `POST /admin/sync-customers` - Sync from Shopify
- `POST /contacts/import` - Import from CSV

### Contact Management Tips
- **Data quality**: Keep phone numbers in international format (+1234567890)
- **Consent tracking**: Always respect customer opt-out preferences
- **Segmentation**: Use tags and custom fields for better targeting
- **GDPR compliance**: Handle data deletion requests promptly

### Import Process
1. **Prepare CSV**: Ensure phone numbers are in correct format
2. **Upload file**: Use the import tool with proper column mapping
3. **Review data**: Check for duplicates and formatting issues
4. **Confirm import**: Review summary before finalizing

### Common Issues
- **Invalid phone numbers**: Check format and country codes
- **Duplicate contacts**: Use merge tools to combine duplicates
- **Import failures**: Verify CSV format and required columns
- **Sync issues**: Ensure Shopify connection is active
