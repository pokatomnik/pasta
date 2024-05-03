import { Signal, useSignal } from "@preact/signals";
import { useCallback } from "preact/hooks";
import { Button } from "shared/Button/ui/Button.tsx";
import { BottomSheetDialog } from "shared/BottomSheet/ui/BottomSheetDialog.tsx";
import { TopBar as TopBarComponent } from "shared/TopBar/TopBar.tsx";
import { TopBarButton as TopBarButtonComponent } from "shared/TopBar/TopBarButton.tsx";

export default function CreatePastaTopBar(
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
      <TopBarComponent title="Pasta♾️">
        <TopBarButtonComponent
          onClick={() => {
            alert("Invoked");
          }}
        >
          Help
        </TopBarButtonComponent>
        <TopBarButtonComponent onClick={showShareDialog}>
          Share
        </TopBarButtonComponent>
      </TopBarComponent>
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
