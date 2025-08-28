import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);

export async function startWorker() {
  await worker.start({
    serviceWorker: {
      // Correct the URL if your app is not at the root
      // Example for base: '/my-app/'
      url: "/public/mockServiceWorker.js",
    },
  });
}
