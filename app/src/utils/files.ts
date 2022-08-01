import copy from 'recursive-copy';

/**
 * TREAD WITH CAUTION: this is a very dangerous function.
 * Overwrites files.
 * @param originalPath
 * @param appPath
 */
export async function copyFiles(
  originalPath: string,
  appPath: string
): Promise<void> {
  await copy(originalPath, appPath, {
    overwrite: true,
  });
}
