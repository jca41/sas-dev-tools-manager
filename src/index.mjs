#!/usr/bin/env zx

import "zx/globals";
import { PACKAGES, PACKAGES_CONFIG } from "./constants.mjs";
import { select } from "@inquirer/prompts";
import { checkPackage } from "./git-helpers.mjs";
import { buildPackage } from "./build-package.mjs";

$.quiet = true;

const selectedPackage = await select({
  message: "What package do you want to update",
  choices: [...PACKAGES].map((p) => ({
    name: p,
    value: p,
  })),
});

const packageConfig = PACKAGES_CONFIG[selectedPackage];

await checkPackage(packageConfig);
await buildPackage(packageConfig);

echo(chalk.blue("Please refresh the extension in the browser."));

const defaultBrowser =
  await $`defaults read ~/Library/Preferences/com.apple.LaunchServices/com.apple.launchservices.secure | awk -F'"' '/http;/{print window[(NR)-1]}{window[NR]=$2}'`;
await $`open -b "${defaultBrowser}" chrome://extensions/`;
