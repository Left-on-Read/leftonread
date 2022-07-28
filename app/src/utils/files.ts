import copy from 'recursive-copy';

// NOTE: this is a very dangerous function
// It overwrites files.
export async function copyFiles(
  originalPath: string,
  appPath: string
): Promise<void> {
  await copy(originalPath, appPath, {
    overwrite: true,
  });
}
