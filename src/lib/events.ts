export const bus = new EventTarget();
export function emitApiError(message: string) {
  try {
    bus.dispatchEvent(new CustomEvent('api-error', { detail: { message } }));
  } catch {
    /* no-op */
  }
}
