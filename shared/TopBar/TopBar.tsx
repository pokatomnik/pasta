import { JSX } from "preact/jsx-runtime";
import { TopBarTitle } from "shared/TopBar/TopBarTitle.tsx";

export const TopBar = (
  props: Readonly<{
    title: string;
    children: JSX.Element | ReadonlyArray<JSX.Element>;
  }>,
) => {
  const { children, title } = props;

  return (
    <div className="flex flex-1 items-center justify-between flex-nowrap h-12 min-h-12 bg-gray-500 pl-2 pr-2">
      <TopBarTitle>
        {title}
      </TopBarTitle>
      <div className="flex shrink h-full">
        {children}
      </div>
    </div>
  );
};
