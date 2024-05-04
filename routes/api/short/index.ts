import { FreshContext, Handlers } from "$fresh/server.ts";
import type { Nullable } from "decorate";
import { getJSONResponse } from "shared/response/model/responses.ts";
import {
  getErrorResponseObject,
  getOkResponseObject,
} from "shared/response/model/Protocol.ts";
import { ConsoleLogger } from "services/Logger/ConsoleLogger.ts";
import type { Logger } from "services/Logger/Logger.ts";
import { ShortsRepositoryKV } from "services/ShortsRepository/ShortsRepositoryKV.ts";
import type { ShortsRepository } from "services/ShortsRepository/ShortsRepository.ts";
import {
  ShortsDatabaseError,
  ShortsDataError,
} from "services/ShortsRepository/ShortsRepositoryError.ts";
import { resolve } from "microdi";

const logger: Logger = resolve(ConsoleLogger);
const shortsRepository: ShortsRepository = resolve(ShortsRepositoryKV);

type DataContainer = Nullable<{
  data?: Nullable<string>;
}>;

export const handler: Handlers = {
  POST: async (
    request: Request,
    context: FreshContext,
  ): Promise<Response> => {
    const jsonRequest: DataContainer = await request.json();
    if (!jsonRequest) {
      return getJSONResponse(
        getErrorResponseObject("EMPTY_BODY"),
        400,
      );
    }

    const data = jsonRequest.data;
    if (!data) {
      return getJSONResponse(
        getErrorResponseObject("NO_DATA"),
        400,
      );
    }

    const hashInsertionResult = await shortsRepository.addShort(data);

    if (typeof hashInsertionResult === "string") {
      return getJSONResponse(
        getOkResponseObject(hashInsertionResult),
        200,
      );
    }

    if (hashInsertionResult instanceof ShortsDataError) {
      return getJSONResponse(
        getErrorResponseObject(hashInsertionResult.message),
        400,
      );
    }

    if (hashInsertionResult instanceof ShortsDatabaseError) {
      logger.error(
        `Database insertion error: "${hashInsertionResult.message}". Client hostname: ${context.remoteAddr.hostname}`,
      );
      return getJSONResponse(
        getErrorResponseObject(hashInsertionResult.message),
        500,
      );
    }

    return getJSONResponse(getErrorResponseObject("UNKNOWN_ERROR"), 500);
  },
};
