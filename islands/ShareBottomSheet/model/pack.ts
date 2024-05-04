import { PastaPacker } from "entities/Pasta/model/PastaPacker.ts";
import { Nullable } from "decorate";
import { Response as ProtocolResponse } from "shared/response/model/Protocol.ts";

export async function packData(
  noteName: string,
  unpacked: string,
  packer: PastaPacker,
  encryptionKey: Nullable<string>,
): Promise<Nullable<string>> {
  return await packer.pack({
    n: noteName,
    d: unpacked,
    e: Boolean(encryptionKey),
  }, encryptionKey);
}

export async function sendToCloud(
  noteName: string,
  unpacked: string,
  packer: PastaPacker,
  encryptionKey: Nullable<string>,
): Promise<ProtocolResponse<string>> {
  const packed = await packData(noteName, unpacked, packer, encryptionKey);
  if (!packed) {
    return {
      status: "error",
      data: null,
      error: "REQUEST_ERROR",
    };
  }
  let response: Nullable<Response> = null;
  try {
    response = await fetch("/api/short", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: packed }),
    });
  } catch {
    return {
      status: "error",
      data: null,
      error: "REQUEST_ERROR",
    };
  }
  try {
    const json: ProtocolResponse<string> = await response.json();
    return json;
  } catch {
    return {
      status: "error",
      data: null,
      error: "REQUEST_ERROR",
    };
  }
}

export function makeUrlFromPacked(packed: string) {
  return `/view#packed=${packed}`;
}

export function makeUrlFromCloud(cloudRef: string) {
  return `/view#cloud=${cloudRef}`;
}
