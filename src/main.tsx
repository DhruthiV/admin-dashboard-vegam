import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

//for that mock api stuff
async function enableMocking() {
  // if (import.meta.env.MODE !== "development") {
  //   return;
  // }
  if (import.meta.env.PROD) {
    return;
  }
  const { worker } = await import("./mocks/browser");
  return worker.start();
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
