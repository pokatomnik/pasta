import { cn } from "shared/classnames/model/classnames.ts";

export const Viewer = (
  props: Readonly<{
    text: string;
    placeholder?: string;
    className?: string;
  }>,
) => {
  const { text, className, placeholder } = props;

  return (
    <div
      placeholder={placeholder}
      className={cn(
        "flex flex-1 basis-full resize-none outline-none border-none font-mono whitespace-pre overflow break-words overflow-x-auto",
        className,
      )}
    >
      {text}
    </div>
  );
};
