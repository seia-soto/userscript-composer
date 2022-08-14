import fs from 'node:fs/promises';
import path from 'node:path';
import {IBaseOptions} from './types.js';
import * as fse from './utils/fse.js';
import * as workdir from './workdir.js';

export type TConfig = Partial<IBaseOptions>

export const location = path.join(workdir.cwd, '.userscript-composer/config.json');

export const read = async () => {
	if (!await fse.isFile(location)) {
		return {};
	}

	try {
		const content = await fs.readFile(location, 'utf8');
		const out = JSON.parse(content) as TConfig;

		return out;
	} catch (error) {
		console.error(error);

		throw new Error('Config file is not valid JSON: ' + location);
	}
};
