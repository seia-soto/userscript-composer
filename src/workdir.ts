/**
 * The workdir module is created to work on system doesn't support temporal directory.
 * The main purpose of this module is using local directory to save application temporal working files.
 * Temporal working files are mainly expected to be esbuild build API output files.
 */
import path from 'node:path';
import fs from 'node:fs/promises';
import fss from 'node:fs';

/**
 * The cached value of current working directory of host
 */
export const cwd = process.cwd();

/**
 * The name of application local working directory
 */
export const root = '.userscript-composer';

/**
 * Check if given path is directory
 * @param location The location of directory
 * @returns True if directory exists on location
 */
export const isDirectory = async (location: string) =>
	fss.existsSync(location)
  && (await fs.stat(location)).isDirectory();

/**
 * Create new "empty" working directory under current working directory
 * @param name The name to use for application working directory
 * @returns The location of application working directory
 */
export const create = async (name: string = root) => {
	const location = path.join(cwd, name);

	if (await isDirectory(location)) {
		await fs.rm(location, {recursive: true});

		return location;
	}

	await fs.mkdir(location, {recursive: true});

	return location;
};

/**
 * Create new temporal directory under application working directory
 * @param name The name of temporal directory to create under application working directory
 * @returns The path of temporal directory
 */
export const temporal = async (name: string = Math.random().toString(36).slice(2)): Promise<string> => {
	const location = path.join(cwd, root, name);

	if (await isDirectory(location)) {
		return temporal();
	}

	await fs.mkdir(location, {recursive: true});

	return location;
};
