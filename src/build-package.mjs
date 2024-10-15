import "zx/globals";

export async function buildPackage({ manager }) {
  await within(async () => {
    $.prefix = "export NVM_DIR=$HOME/.nvm; source $NVM_DIR/nvm.sh; set -e;";
    await $`nvm use`;
    await spinner(
      chalk.blue("Installing and building package."),
      () => $`${manager} install && ${manager} build`
    );
  });

  echo(chalk.blue("Package built successfully."));
}
