import { useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import { useUpdateEffect } from "shared/useUpdateEffect/model/useUpdateEffect.ts";

type IdleRequester = (callback: () => void) => number;
type IdleCanceller = (handler: number) => void;

const idleRequester: IdleRequester = (cb) => {
  try {
    return requestIdleCallback(cb);
  } catch {
    return setTimeout(cb, 50);
  }
};

const idleCanceller: IdleCanceller = (handler) => {
  try {
    return cancelIdleCallback(handler);
  } catch {
    clearTimeout(handler);
  }
};

export const Idle = <T, R>(
  props: Readonly<{
    value: T;
    mapper: (value: T) => R;
    children: (result: R) => JSX.Element | ReadonlyArray<JSX.Element>;
  }>,
) => {
  const { children, value, mapper } = props;
  const [result, setResult] = useState(() => {
    return mapper(value);
  });

  useUpdateEffect(() => {
    const handler = idleRequester(() => {
      const result = mapper(value);
      setResult(result);
    });
    return () => idleCanceller(handler);
  }, [mapper, value]);

  return <>{children(result)}</>;
};
