import { useSignal } from "@preact/signals";
import { useEffect, useState } from "preact/hooks";
import { AsyncQueue } from "shared/AsyncQueue/model/AsyncQueue.ts";

const DEFAULT_DELAY = 70;

const delay = (interval: number) => {
  return new Promise<void>((resolve) => setTimeout(resolve, interval));
};

export const useTyping = (
  params: Readonly<{ placeholder: string; delay?: number }>,
) => {
  const { placeholder, delay: delayMs } = params;
  const [queue] = useState(() => new AsyncQueue());
  const current = useSignal("");

  useEffect(() => {
    ((placeholder) =>
      queue.pushAndGetResult(async () => {
        for (const char of placeholder) {
          current.value += char;
          await delay(delayMs ?? DEFAULT_DELAY);
        }
      }))(placeholder);
  }, [queue, placeholder]);

  return current.value;
};
