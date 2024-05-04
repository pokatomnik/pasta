type ResponseOK<TData> = Readonly<{
  status: "OK";
  data: TData;
  error: null;
}>;

type ResponseError = Readonly<{
  status: "error";
  data: null;
  error: string;
}>;

export type Response<TData> = ResponseOK<TData> | ResponseError;

export const getErrorResponseObject = (
  error: string,
): ResponseError => {
  return { status: "error", data: null, error };
};

export const getOkResponseObject = <TData>(data: TData): ResponseOK<TData> => {
  return { status: "OK", data, error: null };
};
