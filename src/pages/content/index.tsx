console.log("Content Script 👋");

import { Readability } from "@mozilla/readability";
import Browser from "webextension-polyfill";

interface Article {
  title: string;
  byline: string;
  textContent: string;
  length: number;
  excerpt: string;
  siteName: string;
  uri: string;
}

function readDocument(doc: Document): Article {
  const reader = new Readability(doc);
  const article = reader.parse();
  
  if (!article) {
    throw new Error("Could not parse article");
  }
  
  return {
    title: article.title,
    byline: article.byline,
    textContent: article.textContent,
    length: article.length,
    excerpt: article.excerpt,
    siteName: article.siteName,
    uri: doc.baseURI
  };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isNonFeedSite(uri: string): boolean {
  const feedSites = [
    "twitter.com",
    "facebook.com",
    "instagram.com",
    "youtube.com",
    "twitch.tv",
    "tiktok.com",
    "reddit.com",
    "linkedin.com",
    "pinterest.com",
    "google.com",
    "bing.com",
    "yahoo.com",
  ];
  return !feedSites.some((site) => uri.includes(site));
}

async function run() {
  await sleep(1000);
  if (!isNonFeedSite(document.baseURI)) {
    return;
  }

  const clonedDoc = document.cloneNode(true) as Document;
  const article = readDocument(clonedDoc);

  Browser.runtime.sendMessage({ action: "ARTICLE/CREATE", article })
    .then((message) => {
      console.log(message);
    });

}

window.onload = run;