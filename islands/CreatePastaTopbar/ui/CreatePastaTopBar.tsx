import { Signal, useSignal } from "@preact/signals";
import { useCallback } from "preact/hooks";
import { Button } from "shared/Button/ui/Button.tsx";
import { BottomSheetDialog } from "shared/BottomSheet/ui/BottomSheetDialog.tsx";
import { TopBar as TopBarComponent } from "shared/TopBar/ui/TopBar.tsx";
import { TopBarButton as TopBarButtonComponent } from "shared/TopBar/ui/TopBarButton.tsx";

export default function CreatePastaTopBar(
  props: Readonly<{
    textSignal: Signal<string>;
    shareSignal: Signal<boolean>;
  }>,
) {
  const { shareSignal, textSignal } = props;
  const errorDisplayed = useSignal(false);
  const helpDisplayed = useSignal(false);

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

  const showHelp = useCallback(() => {
    helpDisplayed.value = true;
  }, []);
  const hideHelp = useCallback(() => {
    helpDisplayed.value = false;
  }, []);

  return (
    <>
      <TopBarComponent title="Pasta♾️">
        <TopBarButtonComponent title="Show help" onClick={showHelp}>
          Help
        </TopBarButtonComponent>
        <TopBarButtonComponent title="Share note" onClick={showShareDialog}>
          Share
        </TopBarButtonComponent>
      </TopBarComponent>
      <BottomSheetDialog
        position="bp75"
        visibility={helpDisplayed}
        title="Help"
        buttons={
          <Button type="button" buttonType="primary" onClick={hideHelp}>
            Got It!
          </Button>
        }
      >
        <div className="m-4 flex flex-1 basis-full flex-col overflow-x-hidden overflow-y-auto">
          <p className="font-bold mb-1">
            Pasta is a simple web app for sharing notes.
          </p>
          <p className="mb-1">
            Notes can be protected with encryption just contain a unencrypted
            text.
          </p>
          <p className="mb-1">
            Encrypted notes cannot be recovered without a key, so remember a
            decryption key.
          </p>
          <p className="mb-1">
            Unencrypted notes are not protected, so the link with the note is
            accessible to everyone.
          </p>
          <p className="mb-1">There are two approaches to sharing notes:</p>
          <p className="mb-1">
            The first one is to compress note text with Brotli encryption, and
            optionally encrypt it, then place all data to URL and share It.
          </p>
          <p className="mb-1">
            The result URL can be veeeery long, so you may use Pasta service to
            store It much shorter, so your data will be saved in a cloud.
          </p>
          <p className="mb-1">
            If note is encrypted, It will be saved encrypted in the cloud too.
            And we still cannot recover it.
          </p>
          <p className="mb-1">
            However, you may use Pasta service to share encrypted notes.
          </p>
          <p className="mb-1">
            This IS secure, if you use encryption (choose any of them).
          </p>
          <p>
            Or share non-sensitive text as plaintext. You choose!
          </p>
        </div>
      </BottomSheetDialog>
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
