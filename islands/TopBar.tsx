import { Signal, useSignal } from "@preact/signals";
import { useCallback } from "preact/hooks";
import { Button } from "shared/Button/ui/Button.tsx";
import { BottomSheetDialog } from "shared/BottomSheet/ui/BottomSheetDialog.tsx";

export default function TopBar(
  props: Readonly<{
    textSignal: Signal<string>;
    shareSignal: Signal<boolean>;
  }>,
) {
  const { shareSignal, textSignal } = props;
  const errorDisplayed = useSignal(false);

  const showShareDialog = useCallback(() => {
    if (textSignal.value) {
      shareSignal.value = true;
    } else {
      errorDisplayed.value = true;
    }
  }, []);

  const hideError = useCallback(() => {
    errorDisplayed.value = false;
  }, []);

  return (
    <>
      <div className="flex flex-1 items-center justify-between flex-nowrap h-12 min-h-12 bg-gray-500 pl-2 pr-2">
        <TopBarTitle title="Pasta♾️" />
        <div className="flex shrink h-full">
          <TopBarButton
            title="Help"
            onClick={() => {
              alert("Invoked");
            }}
          />
          <TopBarButton title="Share" onClick={showShareDialog} />
        </div>
      </div>
      <BottomSheetDialog
        position="bp25"
        visibility={errorDisplayed}
        title="Oops!"
        buttons={
          <Button type="button" buttonType="primary" onClick={hideError}>
            Got It!
          </Button>
        }
      >
        <div className="m-4 flex flex-1 basis-full flex-col overflow-x-hidden overflow-y-auto">
          Nothing to share, textfield seems to be empty
        </div>
      </BottomSheetDialog>
    </>
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
