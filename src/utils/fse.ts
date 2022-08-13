import fss from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
/**
 * Check if given path is directory
 * @param location The location of directory
 * @returns True if directory exists on location
 */
export const isDirectory = async (location: string) => fss.existsSync(location)
  && (await fs.stat(location)).isDirectory();

/**
 * Check if given path is file
 * @param location The location of file
 * @returns True if file exists on location
 */
export const isFile = async (location: string) => fss.existsSync(location)
  && (await fs.stat(location)).isFile();

/**
 * Find all files under directory *recursively*
 * @param root The path to root directory to find all files
 * @returns The one dimension array of absolute paths of files
 */
export const find = async (root: string): Promise<string[]> => {
	const nodes = await fs.readdir(root);
	const entries: string[] = [];

	for (let i = 0, l = nodes.length; i < l; i++) {
		const node = nodes[i];
		const abs = path.join(root, node);

		// eslint-disable-next-line no-await-in-loop
		if (await isFile(abs)) {
			entries.push(abs);
		} else {
			// eslint-disable-next-line no-await-in-loop
			const files = await find(abs);

			entries.push(...files);
		}
	}

	return entries;
};
