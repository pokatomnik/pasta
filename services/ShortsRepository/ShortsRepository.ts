import { Nullable } from "decorate";
import type {
  ShortsDatabaseError,
  ShortsDataError,
} from "services/ShortsRepository/ShortsRepositoryError.ts";

export interface ShortsRepository {
  getShort(
    sha3: string,
  ): Promise<Nullable<string> | ShortsDatabaseError>;
  addShort(
    data: string,
  ): Promise<string | ShortsDatabaseError | ShortsDataError>;
}
