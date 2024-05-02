import { type Signal, useSignal } from "@preact/signals";
import { JSX } from "preact/jsx-runtime";
import { useCallback, useEffect } from "preact/hooks";
import { BottomSheet } from "shared/BottomSheet/ui/BottomSheet.tsx";
import { PastaPackerSelector } from "entities/Pasta/ui/PastaPackerSelector.tsx";
import { EncryptorName } from "shared/encryption/model/Encryptors.ts";
import { Nullable } from "decorate";
import { cn } from "shared/classnames/model/classnames.ts";
import { Button } from "shared/Button/ui/Button.tsx";

export const ShareBottomSheet = (
  props: Readonly<{
    visibility: Signal<boolean>;
  }>,
) => {
  const { visibility } = props;

  const packerSelectState = useSignal<Nullable<EncryptorName>>(null);
  const encryptionKeyState = useSignal("");
  const encryptionRepeatKeyState = useSignal("");
  const encryptionRepeatKeyErrorState = useSignal("");
  const sharedLinkState = useSignal("");

  useEffect(() => {
    if (!visibility.value) {
      packerSelectState.value = null;
      encryptionKeyState.value = "";
      encryptionRepeatKeyState.value = "";
      encryptionRepeatKeyErrorState.value = "";
      sharedLinkState.value = "";
    }
  }, [visibility.value]);

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

  const handleSubmit: JSX.SubmitEventHandler<HTMLFormElement> = useCallback(
    (evt) => {
      evt.preventDefault();
      if (
        packerSelectState.value &&
        (encryptionKeyState.value !== encryptionRepeatKeyState.value)
      ) {
        encryptionRepeatKeyErrorState.value = "Keys must match";
        return;
      }
      sharedLinkState.value = "asdasd";
    },
    [encryptionKeyState, encryptionRepeatKeyState],
  );

  return (
    <BottomSheet
      position="bp50"
      visibility={visibility}
    >
      <div className="flex flex-grow-0 pt-4 pr-4 pl-4">
        <h2 className="text-2xl text-gray-900 font-bold">Share</h2>
      </div>
      <div
        className={cn(
          "flex flex-1 w-[200%] transition-transform",
          {
            "translate-x-0": !sharedLinkState.value,
            "-translate-x-1/2": Boolean(sharedLinkState.value),
          },
        )}
      >
        <div className="m-4 flex flex-1 basis-full flex-col overflow-x-hidden overflow-y-auto">
          <label className="flex flex-col mb-4">
            <span className="text-md text-gray-900 mb-2">
              Choose encryption variant
            </span>
            <PastaPackerSelector state={packerSelectState} />
          </label>
          {!packerSelectState.value && (
            <p>
              When no encryption is selected, note will be saved unencrypted
            </p>
          )}
          <form
            onSubmit={handleSubmit}
            id="share-pasta"
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
          </form>
        </div>
        <div className="m-4 flex flex-1 basis-full flex-col overflow-x-hidden overflow-y-auto">
          done
        </div>
      </div>
      <hr className="w-full border-t-2 border-t-gray-200" />
      <div className="flex flex-grow-0 p-4 justify-end gap-2">
        <Button type="submit" form="share-pasta" buttonType="secondary">
          Share in 💻
        </Button>
        <Button type="submit" form="share-pasta" buttonType="primary">
          Share in ☁️
        </Button>
      </div>
    </BottomSheet>
  );
};
