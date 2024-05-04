import { type PageProps } from "$fresh/server.ts";
export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/default.min.css"
        />
        <title>Pasta♾️</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body className="overflow-hidden">
        <Component />
      </body>
    </html>
  );
}
