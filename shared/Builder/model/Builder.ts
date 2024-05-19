export const builder = <TMap extends object, TKey extends string, TValue>(
  initialMap: TMap,
  key: TKey,
  value: (map: TMap) => TValue,
) => {
  const updatedMap = {
    ...initialMap,
    [key]: value(initialMap),
  } as const as typeof initialMap & Readonly<{ [key in TKey]: TValue }>;
  return {
    map: updatedMap,
    add: <TKey1 extends string, TValue1>(
      key1: TKey1,
      localBuilder: (map: typeof updatedMap) => TValue1,
    ) => {
      return builder<typeof updatedMap, TKey1, TValue1>(
        updatedMap,
        key1,
        localBuilder,
      );
    },
  };
};
