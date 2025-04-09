import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import customTheme from "./src/lib/theme";

const { parseColor } = require("tailwindcss/lib/util/color");
const flattenColorPalette = require("tailwindcss/lib/util/flattenColorPalette").default;

const config: Config = {
  mode: "jit",
  darkMode: ["selector", '[data-theme="dark"]'],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    extend: customTheme,
  },
  corePlugins: {
    backgroundColor: false,
    borderColor: false,
    backgroundOpacity: false,
    borderOpacity: false,
  },
  plugins: [
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          bg: (value) => {
            const { color } = parseColor(value) || { color: ["255", "255", "255"] };
            const contrastColor =
              Number.parseInt(color[0]) * 0.299 + Number.parseInt(color[1]) * 0.587 + Number.parseInt(color[2]) * 0.114 > 186
                ? "black"
                : "white";

            const bgColor = `color-mix(in srgb, ${value} var(--tw-bg-opacity), transparent)`;

            return {
              "--tw-bg-opacity": "100%",
              "--bg-contrast": contrastColor,
              "--bg-currentcolor": bgColor,
              backgroundColor: bgColor,
            };
          },
          border: (value) => {
            return {
              "--tw-border-opacity": "100%",
              borderColor: `color-mix(in srgb, ${value} var(--tw-border-opacity), transparent)`,
            };
          },
        },
        {
          values: flattenColorPalette(theme("colors")),
          type: ["color", "any"],
        },
      );
      matchUtilities(
        {
          "bg-opacity": (value) => {
            return {
              "--tw-bg-opacity": `${value * 100}%`,
            };
          },
          "border-opacity": (value) => {
            return {
              "--tw-border-opacity": `${value * 100}%`,
            };
          },
        },
        {
          values: theme("opacity"),
        },
      );
    }),
    require("tailwindcss-animate"),
  ],
};

export default config;
