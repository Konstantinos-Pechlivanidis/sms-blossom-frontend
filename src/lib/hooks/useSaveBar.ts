import { useEffect, useState } from 'react';
import { getAppBridge } from '../shopify';
import { getCurrentHost } from '../shopify/host';

// @cursor:start(savebar-hook)
interface UseSaveBarOptions {
  isDirty: boolean;
  onSave: () => void | Promise<void>;
  onDiscard: () => void;
  loading?: boolean;
  disabled?: boolean;
  saveText?: string;
  discardText?: string;
}

/**
 * Hook that manages App Bridge Save Bar visibility and behavior
 * Shows Save Bar when form is dirty, hides when clean
 */
export function useSaveBar({
  isDirty,
  onSave,
  onDiscard,
  loading = false,
  disabled = false,
  saveText = 'Save',
  discardText = 'Discard'
}: UseSaveBarOptions) {
  const [showSaveBar, setShowSaveBar] = useState(false);

  useEffect(() => {
    setShowSaveBar(isDirty && !loading);
  }, [isDirty, loading]);

  const handleSave = async () => {
    try {
      await onSave();
      setShowSaveBar(false);
    } catch (error) {
      console.error('Save failed:', error);
      // Keep save bar visible on error
    }
  };

  const handleDiscard = () => {
    onDiscard();
    setShowSaveBar(false);
  };

  // Use App Bridge Save Bar
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const host = getCurrentHost();
    if (!host) return;
    
    const app = getAppBridge();
    if (!app) return;

    if (showSaveBar) {
      // Show App Bridge Save Bar using proper API
      try {
        app.dispatch({
          type: 'SHOW_SAVE_BAR',
          payload: {
            message: "You have unsaved changes",
            saveAction: {
              content: saveText,
              onAction: handleSave,
              loading,
              disabled: disabled || loading,
            },
            discardAction: {
              content: discardText,
              onAction: handleDiscard,
              disabled: loading,
            }
          }
        });
      } catch (error) {
        console.warn('Failed to show App Bridge Save Bar:', error);
      }
    } else {
      // Hide App Bridge Save Bar
      try {
        app.dispatch({
          type: 'HIDE_SAVE_BAR'
        });
      } catch (error) {
        console.warn('Failed to hide App Bridge Save Bar:', error);
      }
    }

    // Cleanup on unmount
    return () => {
      try {
        app.dispatch({
          type: 'HIDE_SAVE_BAR'
        });
      } catch (error) {
        console.warn('Failed to cleanup App Bridge Save Bar:', error);
      }
    };
  }, [showSaveBar, saveText, discardText, loading, disabled]);

  return {
    SaveBarComponent: null, // App Bridge handles rendering
    isVisible: showSaveBar,
    hide: () => setShowSaveBar(false),
  };
}
// @cursor:end(savebar-hook)