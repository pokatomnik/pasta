import { Pasta } from "entities/Pasta/model/Pasta.ts";
import { SymmetricEncryption } from "../../../shared/encryption/model/SymmetricEncryption.ts";
import { Compressor } from "../../../shared/compression/model/Compressor.ts";
import { type Nullable } from "decorate";

export class PastaPacker {
  public constructor(
    private readonly encryption: SymmetricEncryption,
    private readonly compressor: Compressor,
  ) {}

  public async pack(
    pasta: Pasta,
    key: Nullable<string> = null,
  ): Promise<Nullable<string>> {
    let data: Nullable<string> = pasta.d;

    if (key) {
      data = await this.encryption.encrypt(data, key);
    }

    if (!data) {
      return null;
    }

    data = await this.compressor.compress(data);

    if (!data) {
      return null;
    }

    const actualPasta: Pasta = {
      e: Boolean(key),
      a: pasta.a,
      d: data,
    };

    try {
      const actualPastaStr = JSON.stringify(actualPasta);
      return btoa(actualPastaStr);
    } catch {
      return null;
    }
  }

  public async unpack(
    dataBase64: string,
    key: Nullable<string> = null,
  ): Promise<Nullable<Pasta>> {
    let unpacked: Nullable<string> = null;

    try {
      unpacked = atob(dataBase64);
    } catch { /* do nothing */ }

    if (!unpacked) {
      return null;
    }

    let pasta: Nullable<Pasta> = null;

    try {
      pasta = JSON.parse(unpacked);
    } catch { /* do nothing */ }

    if (!pasta) {
      return null;
    }

    let decompressed: Nullable<string> = null;

    try {
      decompressed = await this.compressor.decompress(pasta.d);
    } catch { /* do nothing */ }

    if (!decompressed) {
      return null;
    }

    if (!pasta.e) {
      const actualPasta: Pasta = {
        a: pasta.a,
        e: false,
        d: decompressed,
      };
      return actualPasta;
    }

    if (pasta.e && !key) {
      return null;
    }

    if (pasta.e && key) {
      const decrypted = await this.encryption.decrypt(decompressed, key);

      if (!decrypted) {
        return null;
      }
      const actualPasta: Pasta = {
        a: pasta.a,
        e: true,
        d: decrypted,
      };

      return actualPasta;
    }

    return null;
  }
}
