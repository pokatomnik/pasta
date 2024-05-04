import { Nullable } from "decorate";

export interface Hasher {
  hash(data: string): Nullable<string>;
}
