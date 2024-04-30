import { AES } from "shared/encryption/model/AES.ts";
import { DES } from "shared/encryption/model/DES.ts";
import { Blowfish } from "shared/encryption/model/Blowfish.ts";
import { Rabbit } from "shared/encryption/model/Rabbit.ts";

export const encryptors = [
  new AES(),
  new DES(),
  new Blowfish(),
  new Rabbit(),
] as const;

export const encryptionNames = encryptors.map((encryptor) => encryptor.name);

export type EncryptorName = typeof encryptionNames[number];
