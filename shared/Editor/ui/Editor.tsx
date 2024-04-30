import { JSX } from "preact/jsx-runtime";
import { useCallback } from "preact/hooks";
import { cn } from "shared/classnames/model/classnames.ts";

export const Editor = (
  props: Readonly<{
    text: string;
    onTextChange: (content: string) => void;
    placeholder?: string;
    className?: string;
  }>,
) => {
  const { text, className, onTextChange, placeholder } = props;

  const handleInput = useCallback<JSX.InputEventHandler<HTMLTextAreaElement>>(
    (evt) => {
      onTextChange(evt.currentTarget.value);
    },
    [onTextChange],
  );

  return (
    <>
      <textarea
        placeholder={placeholder}
        className={cn(
          "flex flex-1 basis-full resize-none outline-none border-none font-mono",
          className,
        )}
        onInput={handleInput}
      >
        {text}
      </textarea>
    </>
  );
};
