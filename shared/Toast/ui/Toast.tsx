import { cn } from "shared/classnames/model/classnames.ts";
import { JSX } from "preact/jsx-runtime";

export const Toast = (
  props: Readonly<
    { children: string; className?: string; style?: JSX.CSSProperties }
  >,
) => {
  const { children, className, style } = props;
  return (
    <div
      className={cn(
        "flex pt-2 pb-2 pl-4 pr-4 items-center w-72 h-16 whitespace-nowrap rounded-xl bg-gray-800 bg-opacity-70 text-white fixed",
        className,
      )}
      style={style}
    >
      <div className="overflow-hidden overflow-ellipsis">{children}</div>
    </div>
  );
};
