import { describe, it, expect } from 'vitest';
import { buildPath, ROUTES, isActiveRoute } from '../src/lib/nav';

describe('Navigation Utilities', () => {
  describe('buildPath', () => {
    it('builds path with base path prefix', () => {
      // Test with default empty base path
      expect(buildPath('/dashboard')).toBe('/dashboard');
      expect(buildPath('dashboard')).toBe('/dashboard');
    });

    it('builds path without base path when not set', () => {
      // Mock environment variable
      const originalEnv = import.meta.env.VITE_BASE_PATH;
      (import.meta as any).env.VITE_BASE_PATH = '';
      
      expect(buildPath('/dashboard')).toBe('/dashboard');
      expect(buildPath('dashboard')).toBe('/dashboard');
      
      // Restore original value
      (import.meta as any).env.VITE_BASE_PATH = originalEnv;
    });
  });

  describe('ROUTES', () => {
    it('provides consistent route constants', () => {
      expect(ROUTES.DASHBOARD).toBe('/');
      expect(ROUTES.CONTACTS).toBe('/contacts');
      expect(ROUTES.DISCOUNTS).toBe('/discounts');
      expect(ROUTES.SEGMENTS).toBe('/segments');
      expect(ROUTES.CAMPAIGNS).toBe('/campaigns');
      expect(ROUTES.AUTOMATIONS).toBe('/automations');
      expect(ROUTES.REPORTS).toBe('/reports');
      expect(ROUTES.SETTINGS).toBe('/settings');
    });

    it('builds dynamic routes correctly', () => {
      expect(ROUTES.CAMPAIGN_DETAIL('123')).toBe('/campaigns/123');
    });
  });

  describe('isActiveRoute', () => {
    it('matches exact routes', () => {
      expect(isActiveRoute('/dashboard', '/dashboard')).toBe(true);
      expect(isActiveRoute('/contacts', '/contacts')).toBe(true);
    });

    it('matches parent routes', () => {
      expect(isActiveRoute('/campaigns/123', '/campaigns')).toBe(true);
      expect(isActiveRoute('/campaigns/edit/123', '/campaigns')).toBe(true);
    });

    it('does not match unrelated routes', () => {
      expect(isActiveRoute('/dashboard', '/contacts')).toBe(false);
      expect(isActiveRoute('/campaigns', '/discounts')).toBe(false);
    });
  });
});
