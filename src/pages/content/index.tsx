import React from "react";
import { createRoot } from "react-dom/client";

function Content(): JSX.Element {
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 text-center h-full p-3 bg-gray-800">
      <header className="flex flex-col items-center justify-center text-white">
        <p>
          Edit <code>src/pages/content/index.jsx</code> and save to reload.
        </p>
        <a
          className="text-blue-400"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React!
        </a>
        <p>Content styled</p>
      </header>
    </div>
  );
}

function init() {
  const rootContainer = document.body;
  if (!rootContainer) throw new Error("Can't find Content root element");
  const root = createRoot(rootContainer);
  root.render(<Content />);
}

document.addEventListener("DOMContentLoaded", init);
