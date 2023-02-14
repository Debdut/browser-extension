import Chrome from 'chrome';

declare namespace chrome {
  export default Chrome;
}

declare module "*.svg" {
  import React = require('react');
  export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.json" {
  const content: string;
  export default content;
}

// if you use css
declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

// if you use scss
declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

// if you use less
declare module "*.module.less" {
  const classes: { [key: string]: string };
  export default classes;
}

// if you use pcss
declare module "*.module.pcss" {
  const classes: { [key: string]: string };
  export default classes;
}
