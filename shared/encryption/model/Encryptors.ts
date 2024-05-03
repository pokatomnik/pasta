import { AES } from "shared/encryption/model/AES.ts";
import { DES } from "shared/encryption/model/DES.ts";
import { Blowfish } from "shared/encryption/model/Blowfish.ts";
import { Rabbit } from "shared/encryption/model/Rabbit.ts";
import { SymmetricEncryption } from "shared/encryption/model/SymmetricEncryption.ts";

export const encryptors = [
  new AES(),
  new DES(),
  new Blowfish(),
  new Rabbit(),
] as const;

export const encryptionNames = encryptors.map((encryptor) => encryptor.name);

const validationSet = new Set<unknown>(encryptionNames);

export const isEncryptionName = (value: unknown): value is EncryptorName => {
  return validationSet.has(value);
};

export const encryptorsMap: ReadonlyMap<EncryptorName, SymmetricEncryption> =
  encryptors.reduce(
    (acc, current) => {
      if (isEncryptionName(current.name)) {
        acc.set(current.name, current);
      }
      return acc;
    },
    new Map<EncryptorName, SymmetricEncryption>(),
  );

export type EncryptorName = typeof encryptionNames[number];
