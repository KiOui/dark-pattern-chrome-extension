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
  contentScriptIframe: {
    entry: "./src/content-script/content-script-iframe.ts",
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
          {
            from: path.resolve(`src/assets/`),
            to: `${path.resolve("dist/assets")}/`,
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
