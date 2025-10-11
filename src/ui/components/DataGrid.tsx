import React, { useState, useMemo } from 'react';
import { 
  IndexTable, 
  DataTable, 
  Banner, 
  EmptyState, 
  Spinner, 
  InlineStack, 
  Text, 
  TextField, 
  Button, 
  Popover, 
  ActionList, 
  Filters, 
  ChoiceList,
  Pagination,
  Badge,
  BlockStack
} from '@shopify/polaris';

// @cursor:start(data-grid)
interface DataGridProps {
  // Table configuration
  headings: Array<{ title: string; id?: string; sortable?: boolean }>;
  rows: React.ReactNode[];
  itemCount: number;
  resourceName?: { singular: string; plural: string };
  
  // States
  loading?: boolean;
  error?: string | null;
  emptyState?: {
    heading: string;
    description: string;
    action?: {
      content: string;
      onAction: () => void;
    };
  };
  
  // Search & Filtering
  searchable?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  
  // Filters
  filters?: Array<{
    key: string;
    label: string;
    filter: React.ReactNode;
    shortcut?: boolean;
  }>;
  appliedFilters?: Array<{
    key: string;
    label: string;
    onRemove: () => void;
  }>;
  onFiltersChange?: (filters: any) => void;
  onFiltersClear?: () => void;
  
  // Saved Views
  savedViews?: Array<{
    id: string;
    name: string;
    query: any;
  }>;
  currentView?: string;
  onViewChange?: (viewId: string) => void;
  onViewSave?: (name: string, query: any) => void;
  onViewDelete?: (viewId: string) => void;
  
  // Sorting
  sortable?: boolean;
  sortValue?: string;
  onSortChange?: (value: string) => void;
  
  // Pagination
  pagination?: {
    hasNext: boolean;
    hasPrevious: boolean;
    onNext: () => void;
    onPrevious: () => void;
    page?: number;
    totalPages?: number;
  };
  
  // Selection
  selectable?: boolean;
  selectedItems?: string[];
  onSelectionChange?: (selectedItems: string[]) => void;
  
  // Bulk actions
  bulkActions?: Array<{
    content: string;
    onAction: (selectedItems: string[]) => void;
    destructive?: boolean;
  }>;
  
  // Row actions
  onRowClick?: (id: string) => void;
}

export function DataGrid({
  headings,
  rows,
  itemCount,
  resourceName = { singular: 'item', plural: 'items' },
  loading = false,
  error = null,
  emptyState,
  searchable = false,
  searchValue = '',
  onSearchChange,
  searchPlaceholder,
  filters = [],
  appliedFilters = [],
  onFiltersChange,
  onFiltersClear,
  savedViews = [],
  currentView,
  onViewChange,
  onViewSave,
  onViewDelete,
  sortable = false,
  sortValue,
  onSortChange,
  pagination,
  selectable = false,
  selectedItems = [],
  onSelectionChange,
  bulkActions = [],
  onRowClick
}: DataGridProps) {
  const [searchActive, setSearchActive] = useState(false);
  const [filtersActive, setFiltersActive] = useState(false);
  const [viewMenuActive, setViewMenuActive] = useState(false);

  // Loading state
  if (loading) {
    return (
      <BlockStack gap="400">
        <InlineStack align="center" gap="200">
          <Spinner size="small" />
          <Text as="p">Loading {resourceName.plural}...</Text>
        </InlineStack>
      </BlockStack>
    );
  }

  // Error state
  if (error) {
    return (
      <Banner tone="critical">
        <Text as="p">Failed to load {resourceName.plural}: {error}</Text>
      </Banner>
    );
  }

  // Empty state
  if (itemCount === 0 && emptyState) {
    return (
      <EmptyState
        heading={emptyState.heading}
        image=""
        action={emptyState.action}
      >
        <Text as="p">{emptyState.description}</Text>
      </EmptyState>
    );
  }

  // No data
  if (itemCount === 0) {
    return (
      <EmptyState
        heading={`No ${resourceName.plural} found`}
        image=""
      >
        <Text as="p">{`There are no ${resourceName.plural} to display.`}</Text>
      </EmptyState>
    );
  }

  // Search and filter controls
  const searchControl = searchable ? (
    <TextField
      label="Search"
      labelHidden
      value={searchValue}
      onChange={onSearchChange || (() => {})}
      placeholder={searchPlaceholder || `Search ${resourceName.plural}...`}
      clearButton
      onClearButtonClick={() => onSearchChange?.('')}
      autoComplete="off"
    />
  ) : null;

  const filterControl = filters.length > 0 ? (
    <Filters
      queryValue={searchValue}
      queryPlaceholder={searchPlaceholder || `Search ${resourceName.plural}...`}
      onQueryChange={onSearchChange || (() => {})}
      onQueryClear={() => onSearchChange?.('')}
      onClearAll={onFiltersClear || (() => {})}
      filters={filters}
      appliedFilters={appliedFilters}
    />
  ) : null;

  // Saved views control
  const viewControl = savedViews.length > 0 ? (
    <Popover
      active={viewMenuActive}
      activator={
        <Button onClick={() => setViewMenuActive(!viewMenuActive)}>
          {currentView ? savedViews.find(v => v.id === currentView)?.name : 'All views'}
        </Button>
      }
      onClose={() => setViewMenuActive(false)}
    >
      <ActionList
        items={savedViews.map(view => ({
          content: view.name,
          onAction: () => {
            onViewChange?.(view.id);
            setViewMenuActive(false);
          }
        }))}
      />
    </Popover>
  ) : null;

  // Bulk actions
  const promotedBulkActions = bulkActions.map(action => ({
    content: action.content,
    onAction: () => action.onAction(selectedItems),
    destructive: action.destructive,
  }));

  return (
    <BlockStack gap="400">
      {/* Search and Filter Controls */}
      {(searchable || filters.length > 0) && (
        <InlineStack gap="400" align="space-between">
          <InlineStack gap="200">
            {searchControl}
            {filterControl}
          </InlineStack>
          {viewControl}
        </InlineStack>
      )}

      {/* Applied Filters */}
      {appliedFilters.length > 0 && (
        <InlineStack gap="200" wrap={false}>
          {appliedFilters.map(filter => (
            <Badge key={filter.key}>
              {filter.label}
            </Badge>
          ))}
        </InlineStack>
      )}

      {/* Data Table */}
      <IndexTable
        headings={headings as any}
        itemCount={itemCount}
        selectedItemsCount={selectable ? selectedItems.length : 0}
        onSelectionChange={onSelectionChange as any}
        selectable={selectable}
        bulkActions={promotedBulkActions}
        resourceName={resourceName}
        sortable={sortable ? [true] : []}
        onSort={onSortChange as any}
      >
        {rows}
      </IndexTable>

      {/* Pagination */}
      {pagination && (
        <InlineStack align="center">
          <Pagination
            hasNext={pagination.hasNext}
            hasPrevious={pagination.hasPrevious}
            onNext={pagination.onNext}
            onPrevious={pagination.onPrevious}
            label={`Page ${pagination.page || 1} of ${pagination.totalPages || 1}`}
          />
        </InlineStack>
      )}
    </BlockStack>
  );
}
// @cursor:end(data-grid)
