// theme/transitions.ts

export const transition = {
  transitionProperty: {
    common: "background-color, border-color, color, fill, stroke, opacity, box-shadow, transform",
    colors: "background-color, border-color, color, fill, stroke",
    dimensions: "width, height",
    position: "left, right, top, bottom",
    background: "background-color, background-image, background-position",
  },
  transitionDuration: {
    slowest: "500ms",
    slower: "400ms",
    slow: "300ms",
    moderate: "200ms",
    fast: "150ms",
    faster: "100ms",
    fastest: "50ms",
  },
  transitionTimingFunction: {
    "ease-in": "cubic-bezier(0.42, 0, 1, 1)",
    "ease-out": "cubic-bezier(0, 0, 0.58, 1)",
    "ease-in-out": "cubic-bezier(0.42, 0, 0.58, 1)",
    "ease-in-smooth": "cubic-bezier(0.32, 0.72, 0, 1)",
  },
};
