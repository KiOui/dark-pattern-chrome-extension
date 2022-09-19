import json from "@rollup/plugin-json";
import vuePlugin from "rollup-plugin-vue";
import {
  chromeExtension,
  simpleReloader,
} from "rollup-plugin-chrome-extension";
import { emptyDir } from "rollup-plugin-empty-dir";
import typescript from "rollup-plugin-typescript2";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import alias from "rollup-plugin-alias";
import path from "path";

export default {
  input: "src/manifest.json",
  output: {
    dir: "dist",
    format: "esm",
    chunkFileNames: "chunks/[name]-[hash].js",
  },
  onwarn: (warning, defaultHandler) => {
    if (warning.code === "THIS_IS_UNDEFINED") return;
    defaultHandler(warning);
  },
  plugins: [
    alias({
      entries: {
        ["@"]: path.resolve(__dirname, "src"),
      },
    }),
    // chromeExtension() must be first, in order to properly treat manifest.json as the entry point
    chromeExtension({
      extendManifest: {},
    }),
    simpleReloader(), // Adds a Chrome extension reloader during watch mode
    vuePlugin({ target: "browser" }),
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
      preventAssignment: true,
    }),
    typescript(),
    json(),
    resolve(),
    commonjs(),
    emptyDir(),
  ],
};
