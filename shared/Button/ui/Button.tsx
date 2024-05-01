import { JSX } from "preact/jsx-runtime";
import { cn } from "shared/classnames/model/classnames.ts";

type ButtonType = "primary" | "secondary";

const buttonClasses: Record<ButtonType, string> = {
  secondary: "bg-gray-300 active:bg-gray-400 text-gray-900",
  primary: "bg-blue-300 active:bg-blue-400 text-gray-900",
} as const;

export const Button = (
  props:
    & Readonly<{
      buttonType: ButtonType;
      onClick?: () => void;
      className?: string;
      children: string;
    }>
    & JSX.HTMLAttributes<HTMLButtonElement>,
) => {
  const { onClick, children, className, buttonType, ...rest } = props;
  return (
    <button
      className={cn(
        "pt-2 pb-2 pr-4 pl-4 rounded-md select-none",
        buttonClasses[buttonType],
        className,
      )}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};
