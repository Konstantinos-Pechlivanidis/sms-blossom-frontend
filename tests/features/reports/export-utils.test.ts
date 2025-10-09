import { describe, it, expect } from 'vitest';
import { 
  generateCSV, 
  generateJSON, 
  generateFilename, 
  getCSVHeaders, 
  transformDataForCSV,
  validateDateRange,
  getExportSizeEstimate
} from '../../../src/features/reports/utils/exportUtils';

describe('Export Utils', () => {
  describe('generateCSV', () => {
    it('should generate CSV with headers and data', () => {
      const data = [
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 }
      ];
      const headers = ['name', 'age'];
      const result = generateCSV(data, headers);
      
      expect(result).toBe('name,age\nJohn,30\nJane,25');
    });

    it('should handle empty data', () => {
      const data: any[] = [];
      const headers = ['name', 'age'];
      const result = generateCSV(data, headers);
      
      expect(result).toBe('name,age');
    });

    it('should escape special characters', () => {
      const data = [
        { name: 'John, Jr.', age: 30 }
      ];
      const headers = ['name', 'age'];
      const result = generateCSV(data, headers);
      
      expect(result).toBe('name,age\n"John, Jr.",30');
    });
  });

  describe('generateJSON', () => {
    it('should generate formatted JSON', () => {
      const data = { name: 'John', age: 30 };
      const result = generateJSON(data);
      
      expect(result).toBe('{\n  "name": "John",\n  "age": 30\n}');
    });
  });

  describe('generateFilename', () => {
    it('should generate safe filename', () => {
      const dateRange = {
        from: '2024-01-01',
        to: '2024-01-31',
        label: 'January 2024'
      };
      const result = generateFilename('overview', 'csv', dateRange);
      
      expect(result).toBe('sms-reports-overview-2024-01-01-to-2024-01-31.csv');
    });
  });

  describe('getCSVHeaders', () => {
    it('should return correct headers for overview', () => {
      const headers = getCSVHeaders('overview');
      expect(headers).toEqual(['metric', 'value']);
    });

    it('should return correct headers for messaging', () => {
      const headers = getCSVHeaders('messaging');
      expect(headers).toEqual(['day', 'sent', 'delivered', 'failed', 'cost']);
    });

    it('should return correct headers for campaigns', () => {
      const headers = getCSVHeaders('campaigns');
      expect(headers).toEqual(['campaignId', 'name', 'revenue', 'orders', 'clicks_lifetime']);
    });

    it('should return correct headers for automations', () => {
      const headers = getCSVHeaders('automations');
      expect(headers).toEqual(['automation', 'orders', 'revenue']);
    });
  });

  describe('transformDataForCSV', () => {
    it('should transform overview data', () => {
      const data = {
        sent: 100,
        delivered: 95,
        failed: 5,
        deliveryRate: 95,
        cost: 50,
        optIns: 10,
        optOuts: 2
      };
      const result = transformDataForCSV(data, 'overview');
      
      expect(result).toHaveLength(7);
      expect(result[0]).toEqual({ metric: 'Total Sent', value: 100 });
    });

    it('should transform messaging data', () => {
      const data = {
        series: [
          { day: '2024-01-01', sent: 100, delivered: 95, failed: 5, cost: 50 }
        ]
      };
      const result = transformDataForCSV(data, 'messaging');
      
      expect(result).toEqual(data.series);
    });
  });

  describe('validateDateRange', () => {
    it('should validate correct date range', () => {
      const dateRange = {
        from: '2024-01-01',
        to: '2024-01-31',
        label: 'January 2024'
      };
      const result = validateDateRange(dateRange);
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject invalid date range', () => {
      const dateRange = {
        from: '2024-01-31',
        to: '2024-01-01',
        label: 'Invalid'
      };
      const result = validateDateRange(dateRange);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Start date must be before end date');
    });

    it('should reject future dates', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const dateRange = {
        from: '2024-01-01',
        to: futureDate.toISOString().split('T')[0],
        label: 'Future'
      };
      const result = validateDateRange(dateRange);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('End date cannot be in the future');
    });
  });

  describe('getExportSizeEstimate', () => {
    it('should return size estimate for data', () => {
      const data = { name: 'John', age: 30 };
      const result = getExportSizeEstimate(data, 'json');
      
      expect(result).toMatch(/\d+\.?\d* (B|KB|MB)/);
    });
  });
});
