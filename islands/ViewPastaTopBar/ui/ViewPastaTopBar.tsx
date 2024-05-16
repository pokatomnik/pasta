import { Signal, useSignal } from "@preact/signals";
import { Nullable } from "decorate";
import { Pasta } from "entities/Pasta/model/Pasta.ts";
import { useEffect } from "preact/hooks";
import { useCallback } from "preact/hooks";
import { TopBar as TopBarComponent } from "shared/TopBar/ui/TopBar.tsx";
import { TopBarButton } from "shared/TopBar/ui/TopBarButton.tsx";
import { copyText } from "shared/clipboard/model/copy.ts";
import {
  useToastContext,
  withToastController,
} from "shared/Toast/ui/ToastController.tsx";
import { BottomSheetDialog } from "shared/BottomSheet/ui/BottomSheetDialog.tsx";
import { Button } from "shared/Button/ui/Button.tsx";

export default withToastController(function ToastControllerViewPastaTopBar(
  props: Readonly<{
    pastaSignal: Signal<Nullable<Pasta>>;
  }>,
) {
  const { pastaSignal } = props;
  const showToast = useToastContext();
  const syncHelpDialogState = useSignal(false);

  useEffect(() => {
    const oldTitle = document.title;
    if (pastaSignal.value?.n) {
      document.title = pastaSignal.value.n;
      return () => {
        document.title = oldTitle;
      };
    }
    return () => {};
  }, [pastaSignal.value?.n]);

  const showSyncHelp = useCallback(() => {
    syncHelpDialogState.value = true;
  }, []);

  const hideSyncHelp = useCallback(() => {
    syncHelpDialogState.value = false;
  }, []);

  const handleClick = useCallback(() => {
    if (pastaSignal.value && !pastaSignal.value.e) {
      copyText(pastaSignal.value.d).then(() => {
        showToast("Copied!");
      }).catch(() => {
        showToast("Failed to copy!");
      });
    }
  }, [showToast]);

  return (
    <>
      <TopBarComponent title={pastaSignal.value?.n ?? ""}>
        <TopBarButton onClick={showSyncHelp}>Sync</TopBarButton>
        {pastaSignal.value && !pastaSignal.value.e
          ? <TopBarButton onClick={handleClick}>Copy</TopBarButton>
          : <></>}
      </TopBarComponent>
      <BottomSheetDialog
        position="bp75"
        visibility={syncHelpDialogState}
        title="Show to sync"
        buttons={
          <Button type="button" buttonType="primary" onClick={hideSyncHelp}>
            Ok, I'll try
          </Button>
        }
      >
        <div className="m-4 flex flex-1 basis-full flex-col overflow-x-hidden overflow-y-auto">
          <p className="mb-1">
            Pasta is a completely anonymous application. It doesn't have any
            accounts, Ie doesn't need a server to create encrypted texts.
            Therefore, synchronization as a feature is missing in the Pasta web
            application itself.
          </p>
          <p>
            But despite this, the synchronization option is still available, for
            this you can save the current page to bookmarks in your browser. If
            your browser supports synchronization, the text will be available
            via the link in the bookmark.
          </p>
        </div>
      </BottomSheetDialog>
    </>
  );
});
