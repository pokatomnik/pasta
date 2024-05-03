import { type Signal, useComputed, useSignal } from "@preact/signals";
import { Nullable } from "decorate";
import { Pasta } from "entities/Pasta/model/Pasta.ts";
import { decompress } from "entities/Pasta/model/PastaPacker.ts";
import { PastaPackerSelector } from "entities/Pasta/ui/PastaPackerSelector.tsx";
import { useCallback, useEffect } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import { BottomSheetDialog } from "shared/BottomSheet/ui/BottomSheetDialog.tsx";
import { Button } from "shared/Button/ui/Button.tsx";
import { Viewer as ViewerComponent } from "shared/Viewer/ui/Viewer.tsx";
import {
  encryptionNames,
  EncryptorName,
  encryptorsMap,
} from "shared/encryption/model/Encryptors.ts";

async function getDecompressedDataFromHash(): Promise<Nullable<Pasta>> {
  const hash = window.location.hash;
  if (!hash) {
    return null;
  }
  const keyValuePairsStr = hash.slice(1);
  const hashValues = keyValuePairsStr.split("&").filter(Boolean).reduce(
    (acc, pairStr) => {
      const [key, value] = pairStr.split("=");
      if (key && value) {
        acc.set(key, value);
      }
      return acc;
    },
    new Map<string, string>(),
  );
  const packed = hashValues.get("packed");
  if (!packed) {
    return null;
  }
  return await decompress(packed);
}

export default function Viewer(
  props: Readonly<{
    data: Signal<Nullable<Pasta>>;
  }>,
) {
  const { data } = props;

  const needDecrypt = useComputed(() => Boolean(data.value?.e));
  const decryptKeyState = useSignal("");
  const algorythmSelectState = useSignal<Nullable<EncryptorName>>(
    encryptionNames[0],
  );

  useEffect(() => {
    data.value = null;
    getDecompressedDataFromHash().then((pasta) => {
      if (pasta) {
        data.value = pasta;
      }
    });
  }, []);

  const handleDecrypt: JSX.SubmitEventHandler<HTMLFormElement> = useCallback(
    async (evt) => {
      evt.preventDefault();
      if (!algorythmSelectState.value || !data.value?.d || !data.value.e) {
        return;
      }
      const algorythm = encryptorsMap.get(algorythmSelectState.value);
      if (!algorythm) {
        return;
      }
      const decrypted = await algorythm.decrypt(
        data.value.d,
        decryptKeyState.value,
      );
      if (!decrypted) {
        // TODO show error
        return;
      }
      data.value = { a: data.value.a, d: decrypted, e: false };
    },
    [],
  );

  const handleDecryptStateInput: JSX.InputEventHandler<HTMLInputElement> =
    useCallback((evt) => {
      decryptKeyState.value = evt.currentTarget.value;
    }, []);

  return (
    <>
      <ViewerComponent
        text={data.value && !data.value.e ? data.value.d : ""}
        placeholder="A new note text"
      />
      <BottomSheetDialog
        visibility={needDecrypt}
        title="Encrypted text"
        position="bp50"
        buttons={
          <Button type="submit" buttonType="primary" form="decrypt-pasta">
            Got It!
          </Button>
        }
      >
        <div className="m-4 flex flex-1 basis-full flex-col overflow-x-hidden overflow-y-auto">
          <form
            id="decrypt-pasta"
            onSubmit={handleDecrypt}
            className="flex flex-col flex-1"
          >
            <label className="flex flex-col mb-4">
              <span className="text-md text-gray-900 mb-2">
                Choose encryption variant
              </span>
              <PastaPackerSelector
                hideUnEncrypted
                state={algorythmSelectState}
              />
            </label>
            <label className="flex flex-col mb-4">
              <span className="text-md text-gray-900 mb-2">
                Decryption key
              </span>
              <input
                type="password"
                required
                value={decryptKeyState.value}
                placeholder="Blah blah"
                className="w-full h-9 border-2 p-1"
                onInput={handleDecryptStateInput}
              />
            </label>
          </form>
        </div>
      </BottomSheetDialog>
    </>
  );
}
