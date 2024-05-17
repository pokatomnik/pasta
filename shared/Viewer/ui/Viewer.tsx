import highlight from "highlight.js";
import { useCallback } from "preact/hooks";
import { cn } from "shared/classnames/model/classnames.ts";
import { Idle } from "shared/Idle/ui/Idle.tsx";

export const Viewer = (
  props: Readonly<{
    text: string;
    placeholder?: string;
    className?: string;
  }>,
) => {
  const { text, className, placeholder } = props;

  const createTextNode = useCallback((text: string) => {
    try {
      return {
        html: highlight.highlightAuto(text).value,
      };
    } catch {
      return { text };
    }
  }, [text]);

  return (
    <Idle value={text} mapper={createTextNode}>
      {({ html, text }) => (
        <code
          placeholder={placeholder}
          className={cn(
            "inline-block resize-none outline-none border-none font-mono whitespace-pre overflow break-words overflow-x-auto",
            className,
          )}
          dangerouslySetInnerHTML={html
            ? {
              __html: html,
            }
            : undefined}
        >
          {text ?? ""}
        </code>
      )}
    </Idle>
  );
};
