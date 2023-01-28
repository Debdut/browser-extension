import React from "react";
import { createRoot } from "react-dom/client";
import Bookmarks from "./Bookmarks";
import "./index.css";

function init() {
  const rootContainer = document.querySelector("#__root");
  if (!rootContainer) throw new Error("Can't find Bookmarks root element");
  const root = createRoot(rootContainer);
  root.render(<Bookmarks />);
}

init();
