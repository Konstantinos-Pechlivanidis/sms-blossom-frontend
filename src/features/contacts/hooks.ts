import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enhancedApiClient } from '../../lib/apiClient';
import { useShop } from '../../lib/shopContext';

// Contact types
export interface Contact {
  id: string;
  phone: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  status: 'active' | 'inactive' | 'unsubscribed';
  subscribed: boolean;
  createdAt: string;
  lastActivity?: string;
  // @cursor-doc:start(new-contact-fields)
  gender?: 'male' | 'female' | 'unknown';
  birthdate?: string; // ISO date
  ageYears?: number; // derived from birthdate
  conversionCount?: number; // lifetime attributed orders
  lastConvertedAt?: string; // ISO date - last conversion timestamp
  // @cursor-doc:end(new-contact-fields)
}

export interface ContactsResponse {
  contacts: Contact[];
  total: number;
  page: number;
  per_page: number;
}

export interface CreateContactRequest {
  phone: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

// Hooks
export function useContacts() {
  const { shop } = useShop();

  return useQuery({
    queryKey: ['contacts', shop] as const,
    queryFn: async () => {
      if (!shop) throw new Error('Shop not available');
      return enhancedApiClient.getContacts({ shop });
    },
    enabled: !!shop,
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function useCreateContact() {
  const { shop } = useShop();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateContactRequest) => {
      if (!shop) throw new Error('Shop not available');
      return enhancedApiClient.createContact({ shop, data });
    },
    onSuccess: () => {
      if (shop) {
        queryClient.invalidateQueries({ queryKey: ['contacts', shop] as const });
      }
    },
  });
}

export function useUpdateContact() {
  const { shop } = useShop();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Contact> }) => {
      if (!shop) throw new Error('Shop not available');
      return enhancedApiClient.updateContact({ shop, id, data });
    },
    onSuccess: () => {
      if (shop) {
        queryClient.invalidateQueries({ queryKey: ['contacts', shop] as const });
      }
    },
  });
}

export function useDeleteContact() {
  const { shop } = useShop();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!shop) throw new Error('Shop not available');
      return enhancedApiClient.deleteContact({ shop, id });
    },
    onSuccess: () => {
      if (shop) {
        queryClient.invalidateQueries({ queryKey: ['contacts', shop] as const });
      }
    },
  });
}

export function useBulkContacts() {
  const { shop } = useShop();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { action: string; contactIds: string[] }) => {
      if (!shop) throw new Error('Shop not available');
      return enhancedApiClient.bulkContacts({ shop, data });
    },
    onSuccess: () => {
      if (shop) {
        queryClient.invalidateQueries({ queryKey: ['contacts', shop] as const });
      }
    },
  });
}

// @cursor-doc:start(contact-filters)
export interface ContactFilters {
  gender?: 'male' | 'female' | 'unknown' | 'all';
  minAge?: number;
  maxAge?: number;
  conversionStatus?: 'all' | 'converted_lifetime' | 'converted_last_90d' | 'not_converted';
}

export function useContactsWithFilters(filters: ContactFilters = {}) {
  const { shop } = useShop();

  return useQuery({
    queryKey: ['contacts', shop, filters] as const,
    queryFn: async () => {
      if (!shop) throw new Error('Shop not available');
      return enhancedApiClient.getContacts({ shop });
    },
    enabled: !!shop,
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
// @cursor-doc:end(contact-filters)
