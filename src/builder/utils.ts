import fs from 'node:fs/promises';
import {IScript} from '../types.js';
import * as fse from '../utils/fse.js';

/**
 * Find all user-scripts under directory
 * @param root The user-script source root
 * @returns Array of user-script absolute paths
 */
export const lookup = async (root: string): Promise<IScript[]> => {
	const files = (await fse.find(root))
		.filter(file => file.includes('.user.'));
	const scripts: IScript[] = await Promise.all(
		files
			.map(async file => ({
				path: file,
				content: (await fs.readFile(file)).toString('utf8'),
			})),
	);

	return scripts;
};
