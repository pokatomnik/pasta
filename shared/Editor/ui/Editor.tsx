import { JSX } from "preact/jsx-runtime";
import { useCallback } from "preact/hooks";
import { cn } from "shared/classnames/model/classnames.ts";

export const Editor = (
  props: Readonly<{
    text: string;
    autofocus?: boolean;
    onTextChange: (content: string) => void;
    placeholder?: string;
    className?: string;
  }>,
) => {
  const { text, className, onTextChange, placeholder, autofocus } = props;

  const handleInput = useCallback<JSX.InputEventHandler<HTMLTextAreaElement>>(
    (evt) => {
      onTextChange(evt.currentTarget.value);
    },
    [onTextChange],
  );

  return (
    <textarea
      autofocus={autofocus}
      placeholder={placeholder}
      autocomplete="off"
      autoComplete="off"
      value={text}
      className={cn(
        "flex flex-1 basis-full resize-none outline-none border-none font-mono whitespace-pre overflow break-words overflow-x-auto",
        className,
      )}
      onInput={handleInput}
    >
      {text}
    </textarea>
  );
};
