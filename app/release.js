/* eslint-disable */
const simpleGit = require('simple-git');
const bump = require('json-bump');
const fs = require('fs');

async function main() {
  const git = simpleGit();
  const currentBranch = (await git.branchLocal()).current;
  const webAppVersionConstantPath = '../web/src/constants/APP_VERSION.ts';

  // Assert on main branch
  if (currentBranch !== 'main') {
    console.log('❌  You must be on the main branch to release.');
    return;
  }

  // Assert branch is up to date
  // We do -a here so that we fetch the tags as well.
  await git.fetch('-a');
  const status = await git.status();
  if (
    status.ahead > 0 ||
    status.behind > 0 ||
    status.modified.length > 0 ||
    status.staged.length > 0
  ) {
    console.log(
      '❌  Your branch is not in sync with the remote repo. You might have local changes that you need to stash.'
    );
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
  const bumpedVersion = await bump('./release/app/package.json', {
    patch: releaseType === 'patch' ? 1 : 0,
    minor: releaseType === 'minor' ? 1 : 0,
    major: releaseType === 'major' ? 1 : 0,
  });

  console.log(
    `ℹ️  Bumped v${bumpedVersion.original} to v${bumpedVersion.updated}`
  );

  // Get commits since last tag
  const commits = await git.log([`v${bumpedVersion.original}..HEAD`]);
  const changelog = commits.all
    .map((commit) => `• ${commit.message}\n`)
    .join('')
    .trim();

  const description = `Changelog since v${bumpedVersion.original}:\n${changelog}`;

  console.log('ℹ️  Updating marketing site...');
  fs.readFile(webAppVersionConstantPath, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    var result = data.replace(bumpedVersion.original, bumpedVersion.updated);

    fs.writeFile(webAppVersionConstantPath, result, 'utf8', function (err) {
      if (err) return console.log(err);
    });
  });

  // Add & Commit code
  await git.add('-A');
  await git.commit(`Release v${bumpedVersion.updated}`);

  // Create a new tag
  await git.addAnnotatedTag(`v${bumpedVersion.updated}`, description);

  console.log(`ℹ️  Created new tag v${bumpedVersion.updated}`);

  console.log(`ℹ️  Pushing updates to origin...`);

  // Push to origin
  await git.push('origin');
  await git.push(['origin', '--tags']);

  // Pull from origin
  await git.fetch('origin');

  console.log(`🚀  Success!`);
}

main();
