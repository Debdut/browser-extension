import React from 'react';
import { createRoot } from 'react-dom/client';
import History from './History';
import './index.css';

function init() {
  const rootContainer = document.querySelector("#__root");
  if (!rootContainer) throw new Error("Can't find History root element");
  const root = createRoot(rootContainer);
  root.render(<History />);
}

init();
