import fs from 'node:fs/promises';
import path from 'path';
import * as builder from '../builder/index.js';
import * as config from '../config.js';
import {IBaseOptions} from '../types.js';
import * as fse from '../utils/fse.js';

export const action = async (options: IBaseOptions) => {
	if (options.clean) {
		await fs.rm(options.out, {recursive: true});
	}

	if (!await fse.isDirectory(options.source)) {
		throw new Error('The source directory not found: ' + options.source);
	}

	if (!await fse.isDirectory(options.out)) {
		await fs.mkdir(options.out, {recursive: true});
	}

	options = Object.assign(
		options,
		await config.read(),
	);

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
