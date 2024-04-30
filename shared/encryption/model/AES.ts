import { type Nullable } from "decorate";
import Crypto from "shared/encryption/model/crypto-js.ts";
import type { SymmetricEncryption } from "shared/encryption/model/SymmetricEncryption.ts";

export class AES implements SymmetricEncryption {
  public readonly name = "AES";

  public encrypt(data: string, key: string): Promise<Nullable<string>> {
    try {
      return Promise.resolve(Crypto.AES.encrypt(data, key).toString());
    } catch {
      return Promise.resolve(null);
    }
  }

  public decrypt(
    encryptedData: string,
    key: string,
  ): Promise<Nullable<string>> {
    try {
      const decrypted = Crypto.AES.decrypt(encryptedData, key).toString(
        Crypto.enc.Utf8,
      );
      if (encryptedData && !decrypted) {
        throw new Error("Invalid key");
      }
      return Promise.resolve(decrypted);
    } catch {
      return Promise.resolve(null);
    }
  }
}
