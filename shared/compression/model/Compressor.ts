import { Nullable } from "decorate";

export interface Compressor {
  compress(data: string): Promise<Nullable<string>>;
  decompress(compressedData: string): Promise<Nullable<string>>;
}
