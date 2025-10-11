# Segments Help

## What you can do here

Create and manage customer segments for targeted SMS marketing campaigns.

### Key Features
- **Advanced filtering**: Target customers by demographics, behavior, and purchase history
- **Live preview**: See customer count before creating campaigns
- **Dynamic segments**: Automatically update based on customer data
- **Import/Export**: Save and reuse segment configurations
- **Performance tracking**: Monitor segment engagement rates

### Key Backend Endpoints
- `GET /segments` - List all segments
- `POST /segments` - Create new segment
- `GET /segments/{id}/preview` - Preview customer count
- `PUT /segments/{id}` - Update segment criteria
- `DELETE /segments/{id}` - Remove segment

### Segmentation Criteria
- **Demographics**: Age, gender, location, language
- **Purchase behavior**: Total spent, order frequency, last purchase
- **Engagement**: Email opens, SMS clicks, website visits
- **Custom fields**: Tags, customer notes, custom attributes
- **Time-based**: New customers, returning customers, inactive

### Best Practices
- **Segment size**: Aim for 100-10,000 customers per segment
- **Overlap prevention**: Avoid targeting same customers multiple times
- **Testing**: Start with small segments to test messaging
- **Refresh frequency**: Update segments regularly for accuracy

### Common Pitfalls
- **Empty segments**: Check criteria aren't too restrictive
- **Overlapping segments**: Ensure customers aren't in multiple campaigns
- **Stale data**: Refresh segments before major campaigns
- **Performance impact**: Large segments may take time to process
