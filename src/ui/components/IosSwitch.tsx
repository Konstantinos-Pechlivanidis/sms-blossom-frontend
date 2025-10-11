import { useId } from 'react';
import { cn } from '../../lib/utils';

// @cursor:start(ios-switch)
type IosSwitchProps = { 
  checked: boolean; 
  onChange: (v: boolean) => void; 
  disabled?: boolean; 
  label?: string 
};

export function IosSwitch({ checked, onChange, disabled, label }: IosSwitchProps) {
  const id = useId();
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={label || 'Toggle'}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        'relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors duration-300 ease-spring',
        checked ? 'bg-brand-500' : 'bg-slate-300',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        'focus:outline-none focus-visible:ios-focus'
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-300 ease-spring',
          checked ? 'translate-x-5' : 'translate-x-0.5'
        )}
      />
    </button>
  );
}
// @cursor:end(ios-switch)
