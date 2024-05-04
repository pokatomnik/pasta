export class ShortsDatabaseError extends Error {
  public constructor(errorCode: string) {
    super(errorCode);
  }
}

export class ShortsDataError extends Error {
  public constructor(errorCode: string) {
    super(errorCode);
  }
}
