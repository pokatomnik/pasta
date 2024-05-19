import { Broadcaster } from "shared/Broadcaster/model/Broadcaster.ts";
import { builder } from "shared/Builder/model/Builder.ts";

export const broadcasters = builder(
  {},
  "editorTextChangeBroadcaster",
  () => new Broadcaster<string>("editor:text"),
).map;
