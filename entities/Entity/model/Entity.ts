export interface ReadonlyEntity {
  readonly id: string;
}

export interface Entity extends ReadonlyEntity {
  readonly version: string;
}
