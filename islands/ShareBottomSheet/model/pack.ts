import { PastaPacker } from "entities/Pasta/model/PastaPacker.ts";
import { Nullable } from "decorate";
import { Response } from "shared/response/model/Protocol.ts";

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
): Promise<Response<string>> {
  const packed = await packData(noteName, unpacked, packer, encryptionKey);
  if (!packed) {
    return {
      status: "error",
      data: null,
      error: "REQUEST_ERROR",
    };
  }
  const response = await fetch("/api/short", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: packed }),
  });
  const json: Response<string> = await response.json();
  return json;
}

export function makeUrlFromPacked(packed: string) {
  return `/view#packed=${packed}`;
}

export function makeUrlFromCloud(cloudRef: string) {
  return `/view#cloud=${cloudRef}`;
}
