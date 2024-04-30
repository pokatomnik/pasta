import type { Nullable } from "decorate";
import type { Compressor } from "shared/compression/model/Compressor.ts";
import { compressText, decompressText } from "textcompress";

export class BrotliCompressor implements Compressor {
  public compress(data: string): Promise<Nullable<string>> {
    try {
      return Promise.resolve(compressText(data));
    } catch {
      return Promise.resolve(null);
    }
  }

  public decompress(compressedData: string): Promise<Nullable<string>> {
    try {
      return Promise.resolve(decompressText(compressedData));
    } catch {
      return Promise.resolve(null);
    }
  }
}
