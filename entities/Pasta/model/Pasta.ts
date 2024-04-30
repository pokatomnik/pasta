import type { ReadonlyEntity } from "entities/Entity/model/Entity.ts";

/**
 * All the fields here is shortened because this entity goes to be used in the URL
 */
export interface Pasta {
  /**
   * Encrypted or not
   */
  readonly e: boolean;

  /**
   * Pasta text
   */
  readonly d: string;

  /**
   * Author
   */
  readonly a: string;
}

export interface PastaEntity extends Pasta, ReadonlyEntity {}
