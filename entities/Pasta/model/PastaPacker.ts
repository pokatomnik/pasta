import { Pasta } from "entities/Pasta/model/Pasta.ts";
import { SymmetricEncryption } from "shared/encryption/model/SymmetricEncryption.ts";
import { Compressor } from "shared/compression/model/Compressor.ts";
import { type Nullable } from "decorate";
import { BrotliCompressor } from "shared/compression/model/BrotliCompressor.ts";
import { AES } from "shared/encryption/model/AES.ts";
import { DES } from "shared/encryption/model/DES.ts";
import { Blowfish } from "shared/encryption/model/Blowfish.ts";
import { Rabbit } from "shared/encryption/model/Rabbit.ts";
import { EncryptorName } from "shared/encryption/model/Encryptors.ts";

export class PastaPacker {
  public constructor(
    private readonly compressor: Compressor,
    private readonly encryption: Nullable<SymmetricEncryption> = null,
  ) {}

  public get encryptionName(): Nullable<EncryptorName> {
    return this.encryption?.name ?? null;
  }

  public async pack(
    pasta: Pasta,
    key: Nullable<string> = null,
  ): Promise<Nullable<string>> {
    let data: Nullable<string> = pasta.d;

    if (key && this.encryption) {
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

  public async decompress(
    dataBase64: string,
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

    return {
      a: pasta.a,
      e: pasta.e,
      d: decompressed,
    };
  }

  public async decrypt(pasta: Pasta, key: string): Promise<Nullable<Pasta>> {
    if (!pasta.e) {
      return pasta;
    }

    if (pasta.e && !key) {
      return null;
    }

    if (pasta.e && key && this.encryption) {
      const decrypted = await this.encryption.decrypt(pasta.d, key);

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

const compressor = new BrotliCompressor();

export const packerWithoutEncryption: PastaPacker = new PastaPacker(compressor);

export const packersWithEncryption: ReadonlyArray<PastaPacker> = [
  new PastaPacker(compressor, new AES()),
  new PastaPacker(compressor, new DES()),
  new PastaPacker(compressor, new Blowfish()),
  new PastaPacker(compressor, new Rabbit()),
];

export const packersWithEncryptionMap: ReadonlyMap<
  EncryptorName,
  PastaPacker
> = packersWithEncryption.reduce(
  (acc, current) => {
    if (current.encryptionName) {
      acc.set(current.encryptionName, current);
    }
    return acc;
  },
  new Map<EncryptorName, PastaPacker>(),
);
