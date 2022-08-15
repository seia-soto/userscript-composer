import fs from 'node:fs/promises';
import path from 'path';
import * as builder from '../builder/index.js';
import * as config from '../config.js';
import {IBaseOptions} from '../types.js';
import * as fse from '../utils/fse.js';

export interface IUnifyOptions extends IBaseOptions {
  name: string,
	header: string
}

export const action = async (options: IUnifyOptions) => {
	if (options.clean) {
		await fs.rm(options.out, {recursive: true});
	}

	options = Object.assign(
		options,
		await config.read(),
	);

	await config.scan(options);

	if (!await fse.isFile(options.header)) {
		throw new Error('Header for unified userscript not found: ' + options.header);
	}

	const scripts = await builder.utils.lookup(options.source);

	// Build unified script
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
