import { useCallback, useEffect } from "preact/hooks";
import { type Signal, useSignal } from "@preact/signals";
import { JSX } from "preact/jsx-runtime";
import { cn } from "shared/classnames/model/classnames.ts";

const breakPoints = {
  bp25: "h-1/4",
  bp50: "h-1/2",
  bp75: "h-3/4",
  bp100: "h-full",
  bp0: "h-0",
} as const;

export const BottomSheet = (
  props: Readonly<{
    position: keyof typeof breakPoints;
    visibility: Signal<boolean>;
    children: JSX.Element | ReadonlyArray<JSX.Element>;
  }>,
) => {
  const { visibility, position, children } = props;
  const backdropVisible = useSignal(visibility.value);

  useEffect(() => {
    if (visibility.value) {
      backdropVisible.value = true;
    }
  }, [visibility.value, backdropVisible]);

  const hideDialog = useCallback(() => {
    try {
      visibility.value = false;
    } catch {
      // noop, tried to update readonly state, seems to be intentional
    }
  }, []);

  const handleTransitionEnd = useCallback(() => {
    if (!visibility.value) {
      backdropVisible.value = false;
    }
  }, [backdropVisible, visibility]);

  useEffect(() => {
    const listener = (evt: KeyboardEvent) => {
      if (evt.key === "Escape") {
        hideDialog();
      }
    };
    globalThis.document.addEventListener("keydown", listener);
    return () => globalThis.document.removeEventListener("keydown", listener);
  }, [hideDialog]);

  return (
    <>
      <div
        onClick={hideDialog}
        className={cn(
          "fixed top-0 right-0 bottom-0 left-0 bg-black transition-all duration-300",
          {
            "pointer-events-none": !backdropVisible.value,
            "opacity-0": !visibility.value,
            "opacity-50": visibility.value,
          },
        )}
      />
      <div
        role="alertdialog"
        className={cn(
          `flex overflow-hidden box-border bg-gray-50 flex-col left-1/2 right-1/2 -translate-x-1/2 w-full 2xl:w-1/3 xl:w-1/3 lg:w-1/2 md:w-1/2 sm:w-full fixed bottom-0 shadow-2xl transition-all duration-300 rounded-t-2xl ${
            breakPoints[position]
          }`,
          {
            "translate-y-0": visibility.value,
            "translate-y-full": !visibility.value,
          },
        )}
        onTransitionEnd={handleTransitionEnd}
      >
        {children}
      </div>
    </>
  );
};
