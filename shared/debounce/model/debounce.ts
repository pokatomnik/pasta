type DebounceFunction<TArgs extends ReadonlyArray<unknown>> = (
  ...args: TArgs
) => void;

export function debounce<TArgs extends ReadonlyArray<unknown>>(
  fn: DebounceFunction<TArgs>,
  debounceInterval: number,
): DebounceFunction<TArgs> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: TArgs): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => fn(...args), debounceInterval);
  };
}
