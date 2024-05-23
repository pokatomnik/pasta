import { useCallback } from "preact/hooks";
import { cn } from "shared/classnames/model/classnames.ts";
import { Idle } from "shared/Idle/ui/Idle.tsx";
import {
  highlight,
  RELEVANCE_THRESHOLD,
} from "shared/Viewer/model/Highlight.ts";

export const Viewer = (
  props: Readonly<{
    text: string;
    className?: string;
  }>,
) => {
  const { text, className } = props;

  const createTextNode = useCallback((text: string) => {
    try {
      const { relevance, value } = highlight(text);
      if (relevance < RELEVANCE_THRESHOLD) {
        return { text };
      }
      return {
        html: value,
      };
    } catch {
      return { text };
    }
  }, [text]);

  return (
    <Idle value={text} mapper={createTextNode}>
      {({ html, text }) => (
        <code
          className={cn(
            "inline-block resize-none outline-none border-none font-mono overflow overflow-x-auto break-words",
            { "whitespace-pre": Boolean(html) },
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
