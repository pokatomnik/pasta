import { type Signal, useSignal } from "@preact/signals";
import { JSX } from "preact/jsx-runtime";
import { useCallback, useEffect } from "preact/hooks";
import { BottomSheetDialog } from "shared/BottomSheet/ui/BottomSheetDialog.tsx";
import { PastaPackerSelector } from "entities/Pasta/ui/PastaPackerSelector.tsx";
import { EncryptorName } from "shared/encryption/model/Encryptors.ts";
import { Nullable } from "decorate";
import { cn } from "shared/classnames/model/classnames.ts";
import { Button } from "shared/Button/ui/Button.tsx";
import {
  packersWithEncryptionMap,
  packerWithoutEncryption,
  PastaPacker,
} from "entities/Pasta/model/PastaPacker.ts";
import { copyText } from "shared/clipboard/model/copy.ts";
import { OrDivider } from "shared/OrDivider/ui/OrDivider.tsx";

const DEFAULT_AUTHOR = "John Doe";

export const ShareBottomSheet = (
  props: Readonly<{
    unpacked: Signal<string>;
    visibility: Signal<boolean>;
  }>,
) => {
  const { visibility, unpacked } = props;

  const pastaAuthorState = useSignal(DEFAULT_AUTHOR);
  const packerSelectState = useSignal<Nullable<EncryptorName>>(null);
  const encryptionKeyState = useSignal("");
  const encryptionRepeatKeyState = useSignal("");
  const encryptionRepeatKeyErrorState = useSignal("");

  const sharedLinkState = useSignal("");

  useEffect(() => {
    if (!visibility.value) {
      pastaAuthorState.value = DEFAULT_AUTHOR;
      packerSelectState.value = null;
      encryptionKeyState.value = "";
      encryptionRepeatKeyState.value = "";
      encryptionRepeatKeyErrorState.value = "";
      sharedLinkState.value = "";
    }
  }, [visibility.value]);

  const handleSetPastaAuthor: JSX.InputEventHandler<HTMLInputElement> =
    useCallback((evt) => {
      pastaAuthorState.value = evt.currentTarget.value;
    }, [pastaAuthorState]);

  const handleSetEncryptionKey: JSX.InputEventHandler<HTMLInputElement> =
    useCallback((evt) => {
      encryptionKeyState.value = evt.currentTarget.value;
      encryptionRepeatKeyErrorState.value = "";
    }, [encryptionKeyState]);

  const handleSetEncryptionKeyRepeat: JSX.InputEventHandler<HTMLInputElement> =
    useCallback((evt) => {
      encryptionRepeatKeyState.value = evt.currentTarget.value;
      encryptionRepeatKeyErrorState.value = "";
    }, [encryptionRepeatKeyState]);

  const handleCopy = useCallback(() => {
    if (sharedLinkState.value) {
      copyText(
        window.location.origin.concat(makeUrlFromPacked(sharedLinkState.value)),
      );
    }
  }, []);

  const handleSubmit: JSX.SubmitEventHandler<HTMLFormElement> = useCallback(
    async (evt) => {
      evt.preventDefault();
      if (
        packerSelectState.value &&
        (encryptionKeyState.value !== encryptionRepeatKeyState.value)
      ) {
        encryptionRepeatKeyErrorState.value = "Keys must match";
        return;
      }
      const packer = packerSelectState.value
        ? packersWithEncryptionMap.get(packerSelectState.value) ??
          packerWithoutEncryption
        : packerWithoutEncryption;
      const packed = await packData(
        pastaAuthorState.value,
        unpacked.value,
        packer,
        encryptionKeyState.value,
      );
      if (!packed) {
        // todo display error here
        return;
      }
      sharedLinkState.value = packed;
    },
    [],
  );

  const hideDialog = useCallback(() => {
    visibility.value = false;
  }, []);

  return (
    <BottomSheetDialog
      position="bp75"
      visibility={visibility}
      title="Share"
      bodyClassName={cn("w-[200%] transition-transform min-h-0", {
        "translate-x-0": !sharedLinkState.value,
        "-translate-x-1/2": Boolean(sharedLinkState.value),
      })}
      buttons={
        <>
          {!sharedLinkState.value && (
            <>
              <Button type="submit" form="share-pasta" buttonType="secondary">
                Share in 💻
              </Button>
              <Button type="submit" form="share-pasta" buttonType="primary">
                Share in ☁️
              </Button>
            </>
          )}
          {sharedLinkState.value && (
            <Button type="button" buttonType="primary" onClick={hideDialog}>
              Awesome
            </Button>
          )}
        </>
      }
    >
      <div className="m-4 flex flex-1 basis-full flex-col overflow-x-hidden overflow-y-auto">
        <form
          id="share-pasta"
          onSubmit={handleSubmit}
          className="flex flex-col flex-1"
        >
          <label className="flex flex-col mb-4">
            <span className="text-md text-gray-900 mb-2">
              Choose encryption variant
            </span>
            <PastaPackerSelector state={packerSelectState} />
          </label>
          <label className="flex flex-col mb-4">
            <span className="text-md text-gray-900 mb-2">
              Author
            </span>
            <input
              type="text"
              required
              value={pastaAuthorState.value}
              placeholder={DEFAULT_AUTHOR}
              className="w-full h-9 border-2 p-1"
              onInput={handleSetPastaAuthor}
            />
          </label>
          {!packerSelectState.value && (
            <p>
              When no encryption is selected, note will be saved unencrypted
            </p>
          )}
          <div
            className={cn(
              "flex gap-2 mb-4 translate-x-0 transition-all duration-200",
              {
                "translate-x-full": !packerSelectState.value,
                "translate-x-0": Boolean(packerSelectState.value),
              },
            )}
          >
            <label className="flex flex-1 flex-col">
              <span className="text-md text-gray-900 mb-2">
                Encryption key
              </span>
              <input
                type="password"
                required={Boolean(packerSelectState.value)}
                value={encryptionKeyState.value}
                placeholder="Blah blah"
                className="w-full h-9 border-2 p-1"
                onInput={handleSetEncryptionKey}
              />
            </label>
            <label className="flex flex-1 flex-col">
              <span className="text-md text-gray-900 mb-2">
                Confirm
              </span>
              <input
                type="password"
                required={Boolean(packerSelectState.value)}
                value={encryptionRepeatKeyState.value}
                placeholder="Repeat here"
                className="w-full h-9 border-2 p-1"
                onInput={handleSetEncryptionKeyRepeat}
              />
              <span className="text-red-500 text-sm">
                {encryptionRepeatKeyErrorState.value}
              </span>
            </label>
          </div>
        </form>
      </div>
      <div className="m-4 flex flex-1 basis-full flex-col overflow-x-hidden overflow-y-auto justify-center items-center">
        <div className="flex flex-1 basis-full flex-col pr-5 pl-5 justify-center items-center">
          <p className="text-xl font-bold mb-2">Well done!</p>
          <p>Now you can:</p>
          <p>
            <a
              className="text-blue-500 underline"
              href={makeUrlFromPacked(sharedLinkState.value)}
              target="_blank"
            >
              Navigate to your pasta
            </a>
          </p>
          <OrDivider>
            <span>OR</span>
          </OrDivider>
          <Button buttonType="primary" type="button" onClick={handleCopy}>
            Copy shared URL
          </Button>
        </div>
      </div>
    </BottomSheetDialog>
  );
};

async function packData(
  author: string,
  unpacked: string,
  packer: PastaPacker,
  encryptionKey: Nullable<string>,
): Promise<Nullable<string>> {
  return await packer.pack({
    a: author,
    d: unpacked,
    e: Boolean(encryptionKey),
  }, encryptionKey);
}

function makeUrlFromPacked(packed: string) {
  return `/view#packed=${packed}`;
}
