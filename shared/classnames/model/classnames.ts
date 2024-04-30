type ClassNamesArg =
  | string
  | null
  | undefined
  | Record<string, unknown>
  | Array<ClassNamesArg>;

export const cn = (...args: ReadonlyArray<ClassNamesArg>): string => {
  return args.reduce<Array<string>>((acc, currentArg) => {
    if (currentArg === undefined || currentArg === null) {
      return acc;
    } else if (typeof currentArg === "string") {
      return acc.concat(currentArg);
    } else if (Array.isArray(currentArg)) {
      return acc.concat(cn(...currentArg));
    } else {
      return acc.concat(
        Object.entries(currentArg).reduce<Array<string>>(
          (currentAcc, [key, value]) => {
            if (value) {
              return currentAcc.concat(key);
            } else {
              return currentAcc;
            }
          },
          [],
        ).join(" "),
      );
    }
  }, []).join(" ");
};
