import { FreshContext, Handlers } from "$fresh/server.ts";
import { resolve } from "microdi";
import { ConsoleLogger } from "services/Logger/ConsoleLogger.ts";
import type { Logger } from "services/Logger/Logger.ts";
import type { ShortsRepository } from "services/ShortsRepository/ShortsRepository.ts";
import {
  ShortsDatabaseError,
} from "services/ShortsRepository/ShortsRepositoryError.ts";
import { ShortsRepositoryKV } from "services/ShortsRepository/ShortsRepositoryKV.ts";
import {
  getErrorResponseObject,
  getOkResponseObject,
} from "shared/response/model/Protocol.ts";
import { getJSONResponse } from "shared/response/model/responses.ts";

const logger: Logger = resolve(ConsoleLogger);
const shortsRepository: ShortsRepository = resolve(ShortsRepositoryKV);

export const handler: Handlers = {
  GET: async (
    _request: Request,
    context: FreshContext,
  ): Promise<Response> => {
    const hash = context.params.hash;
    if (!hash) {
      return getJSONResponse(
        getErrorResponseObject("NO_HASH"),
        400,
      );
    }

    const data = await shortsRepository.getShort(hash);

    if (!data) {
      return getJSONResponse(getOkResponseObject(data));
    }

    if (typeof data === "string") {
      return getJSONResponse(
        getOkResponseObject(data),
        200,
      );
    }

    if (data instanceof ShortsDatabaseError) {
      logger.error(
        `Getting data error: "${data.message}". Client hostname: ${context.remoteAddr.hostname}`,
      );
      return getJSONResponse(
        getErrorResponseObject(data.message),
        500,
      );
    }

    return getJSONResponse(getErrorResponseObject("UNKNOWN_ERROR"), 500);
  },
};
