import type { CodegenConfig } from "@graphql-codegen/cli";

if (!import.meta.env.VITE_GRAPHQL_ENDPOINT) {
  throw new Error("VITE_GRAPHQL_ENDPOINT is not defined, please set it in your .env file");
}

const config: CodegenConfig = {
  schema: import.meta.env.VITE_GRAPHQL_ENDPOINT,
  documents: ["src/**/*.tsx"],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    "./src/gql/": {
      preset: "client",
    },
  },
};

export default config;
