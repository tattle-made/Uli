const { exit } = require("process");
import { watch } from "fs";

const PLUGIN_DIR = "./plugin";
const API_SERVER_DIR = "./api-server";
const DIST_DIR = "./plugin/dist-bun";
const MANIFEST_DIR = "./plugin/manifests";

async function build() {
  Bun.write(
    `${DIST_DIR}/icon16.png`,
    Bun.file(`browser-extension/plugin/icon16.png`)
  );
  // Bun.write(
  //   `${DIST_DIR}./plugin/dist-bun/icon32.png`,
  //   Bun.file(`${PLUGIN_DIR}/icon32.png`)
  // );
  // copy appropriate manifests
  // const args = Bun.argv;
  // const mode = args[2];
  // const platform = args[3];

  // if (!["chrome", "firefox"].includes(platform)) {
  //   console.log("Unsupported Platform. Choose either chrome or firefox");
  //   exit();
  // } else {
  //   if (!["development", "staging", "production"].includes(mode)) {
  //     console.log("Unsupported Mode. Choose dev,stage or prod");
  //     exit();
  //   } else {
  //     Bun.write(
  //       `${DIST_DIR}/manifest.json`,
  //       Bun.file(`${MANIFEST_DIR}/manifest.${platform}.${mode}.json`)
  //     );
  //   }
  // }

  // await Bun.build({
  //   entrypoints: [
  //     "src/options.jsx",
  //     "src/content-script.js",
  //     "src/background.js",
  //   ],
  //   outdir: "./dist-bun",
  //   root: "./plugin",
  // });
}

const watcher = watch(
  import.meta.dir,
  { recursive: true },
  async (event, filename) => {
    if (!filename.includes("dist-bun")) {
      console.log(`Detected ${event} in ${filename}`);
      // copy all icons
      await build();
    }
  }
);

await build();
