import { ComponentProps } from "preact";
import { JSX } from "preact/jsx-runtime";
import { BottomSheet } from "shared/BottomSheet/ui/BottomSheet.tsx";
import { cn } from "shared/classnames/model/classnames.ts";

export const BottomSheetDialog = (
  props:
    & ComponentProps<typeof BottomSheet>
    & Readonly<{
      title: string;
      buttons: JSX.Element | ReadonlyArray<JSX.Element>;
      bodyClassName?: string;
      children: JSX.Element | ReadonlyArray<JSX.Element>;
    }>,
) => {
  const { buttons, children, bodyClassName, position, title, visibility } =
    props;
  return (
    <BottomSheet position={position} visibility={visibility}>
      <div className="flex flex-grow-0 pt-4 pr-4 pl-4">
        <h2 className="text-2xl text-gray-900 font-bold">{title}</h2>
      </div>
      <div className={cn("flex flex-1 min-h-0", bodyClassName)}>
        {children}
      </div>
      <hr className="w-full border-t-2 border-t-gray-200" />
      <div className="flex flex-grow-0 p-4 justify-end gap-2">
        {buttons}
      </div>
    </BottomSheet>
  );
};
