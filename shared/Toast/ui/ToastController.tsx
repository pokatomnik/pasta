import { useSignal } from "@preact/signals";
import { JSX } from "preact/jsx-runtime";
import { useCallback, useContext } from "preact/hooks";
import { createContext } from "preact";
import { Toast } from "shared/Toast/ui/Toast.tsx";
import { ComponentType } from "preact";

const DEFAULT_DURATION = 3000;
const MAX_TOASTS_NUMBER = 5;

type ContextType = Readonly<{
  push: (message: string, duration?: number) => void;
}>;

const ToastContext = createContext<ContextType>({
  push: () => {},
});

const getRandomId = () => Math.random().toString(36).slice(2);

export const ToastController = (
  props: Readonly<{ children: JSX.Element | ReadonlyArray<JSX.Element> }>,
) => {
  const { children } = props;
  const toastsState = useSignal<Map<string, string>>(new Map());
  const push = useCallback((message: string, duration?: number) => {
    const randomId = getRandomId();
    const entries = [
      ...toastsState.value.entries(),
      [randomId, message],
    ] as const;
    toastsState.value = new Map(entries.slice(0, MAX_TOASTS_NUMBER));
    setTimeout(() => {
      const newMap = new Map(toastsState.value.entries());
      newMap.delete(randomId);
      toastsState.value = newMap;
    }, duration ?? DEFAULT_DURATION);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      {Array.from(toastsState.value.entries()).map(([id, message], index) => (
        <Toast
          key={id}
          className={`left-[calc(100%-8px)] -translate-x-full`}
          style={{ top: `${8 * (index + 1) + 64 * index}px` }}
        >
          {message}
        </Toast>
      ))}
    </ToastContext.Provider>
  );
};

export const withToastController = <TProps extends object>(
  Component: ComponentType<TProps>,
) => {
  return function WithToastController(props: TProps) {
    return (
      <ToastController>
        <Component {...props} />
      </ToastController>
    );
  };
};

export const useToastContext = () => {
  const toastContext = useContext(ToastContext);
  return toastContext.push;
};
