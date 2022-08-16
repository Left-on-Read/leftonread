const simpleGit = require('simple-git');

async function main() {
  const git = simpleGit();

  const currentBranch = (await git.branchLocal()).current;

  // Assert on main branch
  //   if (currentBranch !== 'main') {
  //     console.log('❌  You must be on the main branch to release.');
  //     return;
  //   }

  // Assert branch is up to date
  await git.fetch('origin', currentBranch);
  const status = await git.status();
  if (status.ahead > 0 || status.behind > 0) {
    console.log('❌  Your branch is not in sync with the remote repo.');
  }
}

main();
