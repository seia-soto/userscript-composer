import fs from 'node:fs/promises';
import * as build from './build.js';
import * as config from '../config.js';
import {IBaseOptions} from '../types.js';
import * as fse from '../utils/fse.js';

export interface IInitOptions extends IBaseOptions, Record<string, unknown> {}

export const token = '.userscript-composer';

export const action = async (options: IInitOptions) => {
	if (await fse.isDirectory(token)) {
		throw new Error('Already initialized or delete .userscript-composer directory to retry!');
	}

	await fs.mkdir(token, {recursive: true});

	const baseConfig = {
		source: 'scripts',
		out: 'dist',
		header: 'header.txt',
		name: 'unified',
		minify: false,
		clean: true,
	};
	const allowedKeys = Object.keys(baseConfig);

	for (const key of allowedKeys) {
		// @ts-expect-error
		if (typeof options[key] === typeof baseConfig[key]) {
			// @ts-expect-error
			baseConfig[key] = options[key];
		}
	}

	console.log('configured', baseConfig);

	await fs.writeFile(
		config.location,
		JSON.stringify(baseConfig),
		'utf8',
	);
	console.log('created .userscript-composer/config.json');

	if (!await fse.isDirectory(baseConfig.source)) {
		await fs.mkdir(baseConfig.source, {recursive: true});

		console.log('created ' + baseConfig.source);
	}

	if (!await fse.isFile(baseConfig.header)) {
		await fs.writeFile(baseConfig.header, `// ==UserScript==
// @encoding utf-8
// @name Fresh twilight
// @description Created with userscript-composer.
// @author Name <user@domain.tld>
// @version 0.0.1
//
// @grant none
// @run-at document-start
// ==/UserScript==`);

		console.log('created ' + baseConfig.header);
	}

	await build.action(baseConfig);

	console.log('ran initiate build');
};
