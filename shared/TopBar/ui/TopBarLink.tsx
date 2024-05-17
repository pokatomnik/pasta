export const TopBarLink = (
  props: Readonly<{ children: string; href: string; title?: string }>,
) => {
  const { href, children, title } = props;
  return (
    <a
      title={title}
      className="flex items-center h-full transition-colors duration-100 pl-4 pr-4 bg-gray-500 hover:bg-gray-600 text-white rounded-sm"
      href={href}
    >
      {children}
    </a>
  );
};
