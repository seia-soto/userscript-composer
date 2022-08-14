import fs from 'node:fs/promises';
import path from 'path';
import * as builder from '../builder/index.js';
import {IBaseOptions} from '../types.js';

export const action = async (options: IBaseOptions) => {
	if (options.clean) {
		await fs.rm(options.out, {recursive: true});
	}

	const scripts = await builder.utils.lookup(options.source);

	// Build standalone scripts
	const standalones = path.join(options.out, 'standalones');

	await builder.standalone.batch(scripts, {
		source: options.source,
		out: standalones,
		minify: options.minify,
	});

	// Build composed script
	const template = path.join(import.meta.url.replace('file:', ''), '../../assets/base.js');

	await builder.unified.unify(
		path.join(options.out, options.name + '.user.js'),
		{
			template: (await fs.readFile(template, 'utf8')).toString(),
			header: (await fs.readFile(options.header, 'utf8')).toString(),
			scripts,
			minify: options.minify,
		},
	);
};
