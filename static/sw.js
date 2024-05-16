const appVersion = "1.0.0";

const logServiceWorkerMessageError = (message) => {
  console.log(`[ServiceWorker] ${message}`);
};

self.addEventListener("fetch", (e) => {
  e.respondWith(
    (async () => {
      try {
        const response = await fetch(e.request);
        const clonedResponse = response.clone();

        caches.open(appVersion)
          .then((cache) => {
            cache.put(e.request, clonedResponse);
          }).catch((e) => {
            logServiceWorkerMessageError(e.message);
          });

        return response;
      } catch {
        const response = await caches.match(e.request);
        if (response) {
          return response;
        }
        return undefined;
      }
    })(),
  );
});
