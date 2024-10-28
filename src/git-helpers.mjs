import "zx/globals";

export async function checkPackage({ repo, branch }) {
  const directory = `./${repo}`;

  cd(directory);

  echo(chalk.blue(`Directory: ${directory}`));

  const gitStatus = await $`git --no-pager status --short`;

  const hasChanges = gitStatus.lines().filter((l) => Boolean(l)).length > 0;

  if (hasChanges) {
    echo(chalk.red("Detected local changes, stashing them."));
    await $`git stash`;
  }

  await spinner(
    chalk.blue(`Checking out ${branch}.`),
    () => $`git checkout ${branch} && git fetch`
  );

  const checkChanges = await $`git rev-list --count HEAD..origin/${branch}`;

  const numberOfChanges = Number(checkChanges);

  if (numberOfChanges > 0) {
    await spinner(
      chalk.blue(`Pulling ${numberOfChanges} changes.`),
      () => $`git pull`
    );
  } else {
    echo(chalk.blue("Already on latest."));
  }
}
