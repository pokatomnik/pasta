// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $api_joke from "./routes/api/joke.ts";
import * as $index from "./routes/index.tsx";
import * as $view from "./routes/view.tsx";
import * as $CreatePastaTopBar from "./islands/CreatePastaTopBar.tsx";
import * as $Editor from "./islands/Editor.tsx";
import * as $ShareBottomSheet from "./islands/ShareBottomSheet.tsx";
import * as $ViewPastaTopBar from "./islands/ViewPastaTopBar.tsx";
import * as $Viewer from "./islands/Viewer.tsx";
import { type Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/api/joke.ts": $api_joke,
    "./routes/index.tsx": $index,
    "./routes/view.tsx": $view,
  },
  islands: {
    "./islands/CreatePastaTopBar.tsx": $CreatePastaTopBar,
    "./islands/Editor.tsx": $Editor,
    "./islands/ShareBottomSheet.tsx": $ShareBottomSheet,
    "./islands/ViewPastaTopBar.tsx": $ViewPastaTopBar,
    "./islands/Viewer.tsx": $Viewer,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
