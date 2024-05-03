import { type Signal, useSignal } from "@preact/signals";
import { Viewer as ViewerComponent } from "shared/Viewer/ui/Viewer.tsx";
import { Pasta } from "entities/Pasta/model/Pasta.ts";
import { Nullable } from "decorate";
import { useEffect } from "preact/hooks";
import { decompress } from "entities/Pasta/model/PastaPacker.ts";

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

export default function Editor(
  props: Readonly<{
    data: Signal<Nullable<Pasta>>;
  }>,
) {
  const { data } = props;

  const textToDisplay = useSignal("");

  useEffect(() => {
    textToDisplay.value = "";
    getDecompressedDataFromHash().then((pasta) => {
      if (pasta && !pasta.e) {
        textToDisplay.value = pasta.d;
      }
    });
  }, [data.value]);

  return (
    <ViewerComponent
      text={textToDisplay.value}
      placeholder="A new note text"
    />
  );
}
