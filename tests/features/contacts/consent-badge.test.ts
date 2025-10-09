import { describe, it, expect } from 'vitest';
import { getConsentStatus, getConsentSource, getConsentDate, getConsentChangeActions } from '../../../src/features/contacts/components/ConsentBadge';

describe('Consent Badge Utilities', () => {
  describe('getConsentStatus', () => {
    it('should return smsConsentState if available', () => {
      const contact = { smsConsentState: 'opted_in' };
      expect(getConsentStatus(contact)).toBe('opted_in');
    });

    it('should return opted_in for subscribed true', () => {
      const contact = { subscribed: true };
      expect(getConsentStatus(contact)).toBe('opted_in');
    });

    it('should return opted_out for subscribed false', () => {
      const contact = { subscribed: false };
      expect(getConsentStatus(contact)).toBe('opted_out');
    });

    it('should return unknown for no consent info', () => {
      const contact = {};
      expect(getConsentStatus(contact)).toBe('unknown');
    });
  });

  describe('getConsentSource', () => {
    it('should return smsConsentSource if available', () => {
      const contact = { smsConsentSource: 'checkout' };
      expect(getConsentSource(contact)).toBe('checkout');
    });

    it('should return consentSource if available', () => {
      const contact = { consentSource: 'manual' };
      expect(getConsentSource(contact)).toBe('manual');
    });

    it('should return undefined for no source', () => {
      const contact = {};
      expect(getConsentSource(contact)).toBeUndefined();
    });
  });

  describe('getConsentDate', () => {
    it('should return smsConsentAt if available', () => {
      const contact = { smsConsentAt: '2024-01-15T10:30:00Z' };
      expect(getConsentDate(contact)).toBe('2024-01-15T10:30:00Z');
    });

    it('should return consentAt if available', () => {
      const contact = { consentAt: '2024-01-15T10:30:00Z' };
      expect(getConsentDate(contact)).toBe('2024-01-15T10:30:00Z');
    });

    it('should return subscribedAt if available', () => {
      const contact = { subscribedAt: '2024-01-15T10:30:00Z' };
      expect(getConsentDate(contact)).toBe('2024-01-15T10:30:00Z');
    });

    it('should return undefined for no date', () => {
      const contact = {};
      expect(getConsentDate(contact)).toBeUndefined();
    });
  });

  describe('getConsentChangeActions', () => {
    it('should return all actions for unknown state', () => {
      const actions = getConsentChangeActions('unknown');
      expect(actions).toHaveLength(3);
      expect(actions.map(a => a.value)).toEqual(['opted_in', 'opted_out', 'unknown']);
    });

    it('should return opt out and unknown for opted_in state', () => {
      const actions = getConsentChangeActions('opted_in');
      expect(actions).toHaveLength(2);
      expect(actions.map(a => a.value)).toEqual(['opted_out', 'unknown']);
    });

    it('should return opt in and unknown for opted_out state', () => {
      const actions = getConsentChangeActions('opted_out');
      expect(actions).toHaveLength(2);
      expect(actions.map(a => a.value)).toEqual(['opted_in', 'unknown']);
    });
  });
});
