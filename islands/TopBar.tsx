import { Signal } from "@preact/signals";
import { useCallback } from "preact/hooks";

export default function TopBar(
  props: Readonly<{
    shareSignal: Signal<boolean>;
  }>,
) {
  const { shareSignal } = props;
  const showShareDialog = useCallback(() => {
    shareSignal.value = true;
  }, [shareSignal]);
  return (
    <div className="flex flex-1 items-center justify-between flex-nowrap h-12 min-h-12 bg-gray-500 pl-2 pr-2">
      <TopBarTitle title="Pasta♾️" />
      <div className="flex shrink h-full">
        <TopBarButton title="Help" onClick={() => {}} />
        <TopBarButton title="Share" onClick={showShareDialog} />
      </div>
    </div>
  );
}

function TopBarButton(props: Readonly<{ title: string; onClick: () => void }>) {
  const { onClick, title } = props;
  return (
    <button
      className="h-full transition-colors duration-100 pl-2 pr-2 bg-gray-500 hover:bg-gray-600 text-white rounded-sm"
      onClick={onClick}
    >
      {title}
    </button>
  );
}

function TopBarTitle(props: Readonly<{ title: string }>) {
  const { title } = props;
  return (
    <div className="text-center pl-2 pr-2 text-white font-bold">{title}</div>
  );
}
