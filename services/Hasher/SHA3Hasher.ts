import type { Hasher } from "services/Hasher/Hasher.ts";
import { Provide } from "microdi";
import { BoundMethod, Nullable } from "decorate";
import Crypto from "shared/encryption/model/crypto-js.ts";

@Provide()
export class SHA3Hasher implements Hasher {
  @BoundMethod
  public hash(data: string): Nullable<string> {
    try {
      return Crypto.SHA3(data).toString();
    } catch {
      return null;
    }
  }
}
