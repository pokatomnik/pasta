export const TopBarButton = (
  props: Readonly<{ children: string; onClick: () => void }>,
) => {
  const { onClick, children } = props;
  return (
    <button
      className="h-full transition-colors duration-100 pl-2 pr-2 bg-gray-500 hover:bg-gray-600 text-white rounded-sm"
      onClick={onClick}
    >
      {children}
    </button>
  );
};
