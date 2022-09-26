const path = require("path");
const { defineConfig } = require("@vue/cli-service");

const pages = {
  popup: {
    template: "./src/popup/index.html",
    entry: "./src/popup/main.ts",
    title: "Popup",
  },
  options: {
    template: "./src/options/index.html",
    entry: "./src/options/main.ts",
    title: "Options",
  },
  background: {
    entry: "./src/background.ts",
  },
  contentScript: {
    entry: "./src/content-script/content-script.ts",
  },
};

const isDevMode = process.env.NODE_ENV === "development";

module.exports = defineConfig({
  transpileDependencies: true,
  pages,
  filenameHashing: false,
  chainWebpack: (config) => {
    config.plugin("copy").use(require("copy-webpack-plugin"), [
      {
        patterns: [
          {
            from: path.resolve(`src/manifest.${process.env.NODE_ENV}.json`),
            to: `${path.resolve("dist")}/manifest.json`,
          },
          {
            from: path.resolve(`public/`),
            to: `${path.resolve("dist")}/`,
          },
        ],
      },
    ]);
  },
  configureWebpack: {
    output: {
      filename: `[name].js`,
      chunkFilename: `[name].js`,
    },
    devtool: isDevMode ? "inline-source-map" : false,
  },
  css: {
    extract: false, // Make sure the css is the same
  },
});
