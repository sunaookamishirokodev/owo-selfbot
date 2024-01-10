import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";

export default {
  input: "./src/owo.ts",
  output: {
    file: "owo.js",
    format: "esm",
  },
  plugins: [typescript(), terser()],
};
