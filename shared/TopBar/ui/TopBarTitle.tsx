export const TopBarTitle = (
  props: Readonly<{
    children: string;
  }>,
) => {
  const { children } = props;
  return (
    <div className="text-center pl-2 pr-2 text-white font-bold whitespace-nowrap">
      {children}
    </div>
  );
};
