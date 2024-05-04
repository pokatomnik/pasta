import type { Nullable } from "decorate";
import { Pasta } from "entities/Pasta/model/Pasta.ts";
import { decompress } from "entities/Pasta/model/PastaPacker.ts";
import type { Response as ProtocolResponse } from "shared/response/model/Protocol.ts";

export async function getDecompressedDataFromHash(): Promise<Nullable<Pasta>> {
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
