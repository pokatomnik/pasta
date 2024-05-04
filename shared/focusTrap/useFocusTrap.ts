import { useEffect, useRef } from "preact/hooks";

const focusableSelectors: ReadonlyArray<string> = [
  "a[href]:not([disabled])",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
];

const focusableElementsSelector = focusableSelectors.join(", ");

const focusedElementsSelector = focusableSelectors.map((selector) => {
  return `${selector}:focus`;
}).join(", ");

export const useFocusTrap = <TElement extends HTMLElement>(
  enabled: boolean,
) => {
  const ref = useRef<TElement | null>(null);

  useEffect(() => {
    const handler = (evt: FocusEvent) => {
      evt.preventDefault();
      setTimeout(() => {
        const atLeastOneNodeIsFocused = Array.from(
          ref.current?.querySelectorAll(focusedElementsSelector) ??
            new Array<Element>(),
        ).length > 0;
        const firstNode = ref.current?.querySelector(focusableElementsSelector);
        if (atLeastOneNodeIsFocused) {
          return;
        }
        if (firstNode && firstNode instanceof HTMLElement) {
          firstNode.focus({ preventScroll: true });
        } else {
          ref.current?.focus({ preventScroll: true });
        }
      }, 0);
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
