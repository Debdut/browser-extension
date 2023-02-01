console.log("Service Worker 👋");

import Browser from "webextension-polyfill";

Browser.runtime.onMessage.addListener(
  async (request: any, sender): Promise<any> => {
    switch (request.action) {
      case "ARTICLE/CREATE": {
        const { article } = request;
        const response = await fetch("https://localhost/api/article", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(article),
        });

        const message = await response.text();

        return message;
      }
    }
  }
);