import sharedConfig from "@repo/tailwind-config/tailwind.config";
import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";

const config: Pick<Config, "presets" | "plugins"> = {
  presets: [
    {
      ...sharedConfig,
      content: ["src/**/*.{ts,tsx}", "../../packages/ui/src/**/*{.js,.ts,.jsx,.tsx}"],
    },
  ],
  plugins: [typography],
};

export default config;
