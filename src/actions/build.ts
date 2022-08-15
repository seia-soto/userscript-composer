import fs from 'node:fs/promises';
import * as builder from '../builder/index.js';
import * as config from '../config.js';
import {IBaseOptions, IScript} from '../types.js';
import * as fse from '../utils/fse.js';

export const action = async (options: IBaseOptions) => {
	if (options.clean) {
		await fs.rm(options.out, {recursive: true});
	}

	options = Object.assign(
		await config.read(),
		options,
	);

	if (!await fse.isFile(options.source)) {
		throw new Error('The source file not found: ' + options.source);
	}

	// Build one standalone userscript
	const script: IScript = {
		path: options.source,
		content: (await fs.readFile(options.source)).toString(),
	};

	const where = await builder.standalone.shim(script.path, options.source, options.out);
	const what = await builder.standalone.build(script, {
		minify: options.minify,
	});

	await fs.writeFile(
		where,
		what,
		'utf8',
	);
};
