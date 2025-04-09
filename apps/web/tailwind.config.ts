import sharedConfig from "@repo/tailwind-config/tailwind.config";
import type { Config } from "tailwindcss";

const config: Pick<Config, "presets"> = {
  presets: [
    {
      ...sharedConfig,
      content: ["src/**/*.{ts,tsx}", "../../packages/ui/src/**/*{.js,.ts,.jsx,.tsx}"],
    },
  ],
};

export default config;
