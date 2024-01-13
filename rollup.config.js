import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default {
  input: "./index.ts",
  output: {
    file: "owo.js",
    format: "esm",
  },
  plugins: [typescript(), terser()],
};
