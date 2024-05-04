import { useEffect, useRef } from "preact/hooks";

const selector =
  'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])';

export const useFocusTrap = (enabled: boolean) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (evt: FocusEvent) => {
      evt.preventDefault();
      const firstNode = ref.current?.querySelector(selector);
      if (firstNode && firstNode instanceof HTMLElement) {
        firstNode.focus();
      } else {
        ref.current?.focus();
      }
    };
    if (enabled) {
      ref.current?.addEventListener("focusout", handler);
    }
    return () => {
      ref.current?.removeEventListener("focusout", handler);
    };
  }, [enabled]);

  return ref;
};
