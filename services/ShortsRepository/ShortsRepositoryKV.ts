import { BoundMethod, Nullable } from "decorate";
import type { ShortsRepository } from "services/ShortsRepository/ShortsRepository.ts";
import {
  ShortsDatabaseError,
  ShortsDataError,
} from "services/ShortsRepository/ShortsRepositoryError.ts";
import type { Hasher } from "services/Hasher/Hasher.ts";
import { SHA3Hasher } from "services/Hasher/SHA3Hasher.ts";
import { Provide } from "microdi";

@Provide(SHA3Hasher)
export class ShortsRepositoryKV implements ShortsRepository {
  public constructor(private readonly hasher: Hasher) {}

  private getKey(hash: string) {
    return ["shorts", hash] as const;
  }

  /**
   * Method returns value behind the hash if exists
   * - returns value if It exists
   * - or null if not
   * - or error on database error
   * @param hash
   * @returns value or null
   */
  @BoundMethod
  public async getShort(
    hash: string,
  ): Promise<Nullable<string> | ShortsDatabaseError> {
    await using kv = await Deno.openKv(Deno.env.get("KV_DB"));
    const key = this.getKey(hash);
    try {
      const result = await kv.get<string>(key);
      return result.value;
    } catch {
      return new ShortsDatabaseError("DB_ERROR");
    }
  }

  /**
   * Method returns memoized data or error:
   * - returns a hash of value from database if exists
   * - or computes a new hash from value, saves it to database and returns it
   * - or returns Error on error
   * @param data
   * @returns hash of data or null if error
   */
  @BoundMethod
  public async addShort(
    data: string,
  ): Promise<string | ShortsDatabaseError | ShortsDataError> {
    let hash: Nullable<string> = null;
    try {
      hash = this.hasher.hash(data);
    } catch { /* handle error below */ }
    if (!hash) {
      return new ShortsDataError("HASHING_ERROR");
    }

    const key = this.getKey(hash);

    await using kv = await Deno.openKv(Deno.env.get("KV_DB"));
    let existingEntry: Nullable<Deno.KvEntryMaybe<string>> = null;
    try {
      existingEntry = await kv.get<string>(key);
    } catch { /* handle error below */ }
    if (existingEntry === null) {
      return new ShortsDatabaseError("GET_ENTRY_ERROR");
    }

    // There is existing value behind this hash
    if (existingEntry.value !== null) {
      // Collision check return collision error if the requested hash collides with existing hash
      if (existingEntry.value === data) {
        return existingEntry.value;
      } else {
        return new ShortsDatabaseError("COLLISION_ERROR");
      }
    }

    let insertResult: Nullable<Deno.KvCommitResult | Deno.KvCommitError> = null;
    try {
      insertResult = await kv.atomic().check({
        key: key,
        versionstamp: null,
      }).set(key, data).commit();
    } catch { /* handle incorrect commit value below */ }
    if (insertResult === null) {
      return new ShortsDatabaseError("INSERTION_ERROR");
    }

    return insertResult.ok ? hash : new ShortsDatabaseError("INSERTION_ERROR");
  }
}
