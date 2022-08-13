import type {Loader} from 'esbuild';
import fs from 'node:fs/promises';
import path from 'path';
import {compress} from '../minify.js';
import {pack} from '../packer.js';
import {build, bundle} from '../transform.js';
import {IBaseOptions} from '../types.js';
import {head} from '../userscript.js';
import * as fse from '../utils/fse.js';

export const action = async (options: IBaseOptions) => {
	if (options.clean) {
		await fs.rm(options.out, {recursive: true});
	}

	const files = (await fse.find(options.source))
		.filter(file => file.includes('.user.'));
	const scripts = await Promise.all(
		files
			.map(async file => ({
				path: file,
				content: (await fs.readFile(file)).toString('utf8'),
			})),
	);

	// Build standalone scripts
	const standalones = path.join(options.out, 'standalones');

	await Promise.allSettled(
		scripts
			.map(async script => {
				const outfile = path.join(
					standalones,
					path.relative(options.source, script.path),
				);
				const outdir = path.dirname(outfile);

				if (!await fse.isDirectory(outdir)) {
					await fs.mkdir(outdir, {recursive: true});
				}

				await bundle({
					entryPoints: [script.path],
					outfile,
				});

				const header = head(script.content);
				const transformed = (await fs.readFile(outfile, 'utf8')).toString();
				const out = options.minify
					? await compress(transformed, {})
					: transformed;

				await fs.writeFile(outfile, header + '\n' + out, 'utf8');
			}),
	);

	// Build composed script
	const template = path.join(import.meta.url.replace('file:', ''), '../../assets/base.js');
	const outfile = path.join(options.out, options.name + '.user.js');
	const transformed = await Promise.all(
		scripts
			.map(async script => {
				const out = await build(
					script.content,
					{
						loader: script.path.split('.').pop() as Loader,
					},
				);

				return head(script.content) + '\n' + out;
			}),
	);

	const packed = await pack(
		(await fs.readFile(template)).toString(),
		{
			head: (await fs.readFile(options.header)).toString(),
			scripts: transformed,
		},
		options.minify,
	);

	await fs.writeFile(outfile, packed, 'utf8');
};
