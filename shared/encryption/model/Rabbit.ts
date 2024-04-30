import { type Nullable } from "decorate";
import Crypto from "shared/encryption/model/crypto-js.ts";
import type { SymmetricEncryption } from "shared/encryption/model/SymmetricEncryption.ts";

export class Rabbit implements SymmetricEncryption {
  public readonly name = "Rabbit";

  public encrypt(data: string, key: string): Promise<Nullable<string>> {
    try {
      return Promise.resolve(Crypto.Rabbit.encrypt(data, key).toString());
    } catch {
      return Promise.resolve(null);
    }
  }

  public decrypt(
    encryptedData: string,
    key: string,
  ): Promise<Nullable<string>> {
    try {
      return Promise.resolve(
        Crypto.Rabbit.decrypt(encryptedData, key).toString(Crypto.enc.Utf8),
      );
    } catch {
      return Promise.resolve(null);
    }
  }
}
