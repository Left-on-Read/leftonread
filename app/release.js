/* eslint-disable */
const simpleGit = require('simple-git');
const bump = require('json-bump');

async function main() {
  const git = simpleGit();
  const currentBranch = (await git.branchLocal()).current;

  // Assert on main branch
  if (currentBranch !== 'main') {
    console.log('❌  You must be on the main branch to release.');
    return;
  }

  // Assert branch is up to date
  await git.fetch('origin', currentBranch);
  const status = await git.status();
  if (
    status.ahead > 0 ||
    status.behind > 0 ||
    status.modified.length > 0 ||
    status.staged.length > 0
  ) {
    console.log('❌  Your branch is not in sync with the remote repo.');
    return;
  }

  // Assert proper release command was passed in
  const releaseType = process.argv[2].trim();
  if (
    releaseType !== 'patch' &&
    releaseType !== 'minor' &&
    releaseType !== 'major'
  ) {
    console.log('❌  Must specify a release type: patch, minor, major');
    return;
  }

  console.log(`ℹ️  Running a ${releaseType} release`);

  // Bump the version
//   const bumpedVersion = await bump('./release/app/package.json', {
//     patch: releaseType === 'patch' ? 1 : 0,
//     minor: releaseType === 'minor' ? 1 : 0,
//     major: releaseType === 'major' ? 1 : 0,
//   });

//   console.log(
//     `ℹ️  Bumped v${bumpedVersion.original} to v${bumpedVersion.updated}`
//   );

  // Get commits since last tag
  const commits = await git.log([`v${bumpedVersion.original}..HEAD`]);
  console.log(commits);

//   // Add & Commit code
//   await git.add('.');
//   await git.commit(`Release v${bumpedVersion.updated}`);

//   // Create a new tag
//   await git.addAnnotatedTag(
//     `v${bumpedVersion.updated}`,
//     `Release for ${bumpedVersion.updated}. Previous version: ${bumpedVersion.original}`
//   );

//   console.log(`ℹ️  Created new tag v${bumpedVersion.updated}`);

//   console.log(`ℹ️  Pushing updates to origin...`);

//   // Push to origin
//   await git.push('origin');
//   await git.push(['origin', '--tags']);

//   // Pull from origin
//   await git.fetch('origin');

//   console.log(`🚀  Success!`);
// }

main();
