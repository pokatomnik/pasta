import { Nullable } from "decorate";
import type {
  ShortsDatabaseError,
  ShortsDataError,
} from "services/ShortsRepository/ShortsRepositoryError.ts";

export interface ShortsRepository {
  getShort(
    hash: string,
  ): Promise<Nullable<string> | ShortsDatabaseError>;
  addShort(
    data: string,
  ): Promise<string | ShortsDatabaseError | ShortsDataError>;
}
