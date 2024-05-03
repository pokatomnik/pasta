import { JSX } from "preact/jsx-runtime";

export const OrDivider = (props: Readonly<{ children: JSX.Element }>) => {
  const { children } = props;
  return (
    <div className="flex gap-1 flex-nowrap items-center w-full justify-center mt-2 mb-2">
      <hr className="border-t-2 flex basis-full" />
      {children}
      <hr className="border-t-2 flex basis-full" />
    </div>
  );
};
