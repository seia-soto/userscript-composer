import fs from 'node:fs/promises';
import * as builder from '../builder/index.js';
import * as config from '../config.js';
import {IBaseOptions} from '../types.js';

export const action = async (options: IBaseOptions) => {
	if (options.clean) {
		await fs.rm(options.out, {recursive: true});
	}

	options = Object.assign(
		await config.read(),
		options,
	);

	await config.scan(options);

	const scripts = await builder.utils.lookup(options.source);

	// Build standalone scripts
	await builder.standalone.batch(scripts, {
		source: options.source,
		out: options.out,
		minify: options.minify,
	});
};
