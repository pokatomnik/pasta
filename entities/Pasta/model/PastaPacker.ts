import { Pasta } from "entities/Pasta/model/Pasta.ts";
import { SymmetricEncryption } from "shared/encryption/model/SymmetricEncryption.ts";
import { type Nullable } from "decorate";
import { BrotliCompressor } from "shared/compression/model/BrotliCompressor.ts";
import { AES } from "shared/encryption/model/AES.ts";
import { DES } from "shared/encryption/model/DES.ts";
import { Blowfish } from "shared/encryption/model/Blowfish.ts";
import { Rabbit } from "shared/encryption/model/Rabbit.ts";
import { EncryptorName } from "shared/encryption/model/Encryptors.ts";

const compressor = new BrotliCompressor();
export class PastaPacker {
  public constructor(
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

    data = await compressor.compress(data);

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
}

export async function decrypt(
  encryption: SymmetricEncryption,
  pasta: Pasta,
  key: string,
): Promise<Nullable<Pasta>> {
  if (!pasta.e) {
    return pasta;
  }

  if (pasta.e && !key) {
    return null;
  }

  if (pasta.e && key) {
    const decrypted = await encryption.decrypt(pasta.d, key);

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

export async function decompress(
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
    decompressed = await compressor.decompress(pasta.d);
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

export const packerWithoutEncryption: PastaPacker = new PastaPacker();

export const packersWithEncryption: ReadonlyArray<PastaPacker> = [
  new PastaPacker(new AES()),
  new PastaPacker(new DES()),
  new PastaPacker(new Blowfish()),
  new PastaPacker(new Rabbit()),
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
