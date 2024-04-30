import type { Nullable } from "decorate";

/**
 * Symmetric encryption. Must work in browser and Deno runtime.
 */
export interface SymmetricEncryption {
  readonly name: string;

  /**
   * Encrypt data string with encryption key
   * @param data string data of any length
   * @param key encryption key of any length
   * @returns encrypted string or null if there was error
   */
  encrypt(data: string, key: string): Promise<Nullable<string>>;

  /**
   * Decrypt previously encrypted string with encryption key
   * @param encryptedData encrypted data of any length
   * @param key encryption key of any length
   * @returns dectypted string or null if there was error
   */
  decrypt(encryptedData: string, key: string): Promise<Nullable<string>>;
}
