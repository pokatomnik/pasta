import type { Nullable } from "decorate";
import { Pasta } from "entities/Pasta/model/Pasta.ts";
import { decompress } from "entities/Pasta/model/PastaPacker.ts";
import type { Response as ProtocolResponse } from "shared/response/model/Protocol.ts";

const waitTextHash = (): Promise<string> => {
  return new Promise<string>((resolve) => {
    globalThis.addEventListener("hashchange", function eventHandler(evt) {
      try {
        const newURL = new URL(evt.newURL);
        resolve(newURL.hash);
      } catch {
        return resolve("");
      } finally {
        globalThis.removeEventListener("hashchange", eventHandler);
      }
    });
  });
};

export async function* pastaFromURLIterator(): AsyncIterable<Nullable<Pasta>> {
  const hash = window.location.hash;
  const pasta = await getDecompressedDataFromHash(hash);
  yield pasta;
  while (true) {
    const newHash = await waitTextHash();
    const pasta = await getDecompressedDataFromHash(newHash);
    yield pasta;
  }
}

async function getDecompressedDataFromHash(
  hash: string,
): Promise<Nullable<Pasta>> {
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
  if (packed) {
    try {
      return await decompress(packed);
    } catch {
      return null;
    }
  }

  const cloudRef = hashValues.get("cloud");
  if (!cloudRef) {
    return null;
  }

  let response: Nullable<Response> = null;
  try {
    response = await fetch(`/api/short/${cloudRef}`);
  } catch { /* handle error below */ }
  if (!response) {
    return null;
  }

  let json: Nullable<ProtocolResponse<string>> = null;
  try {
    json = await response.json();
  } catch { /* handle error below */ }
  if (!json) {
    return null;
  }

  if (json.status === "error") {
    return null;
  }

  const data = json.data;

  try {
    return await decompress(data);
  } catch { /* handle error below */ }

  return null;
}
