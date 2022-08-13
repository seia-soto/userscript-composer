import type {Loader} from 'esbuild';
import fs from 'node:fs/promises';
import path from 'path';
import {pack} from '../packer.js';
import {build, bundle} from '../transform.js';
import {IBaseOptions} from '../types.js';
import {head} from '../userscript.js';
import * as fse from '../utils/fse.js';

export const action = async (options: IBaseOptions) => {
	const scripts = (await fse.find(options.source))
		.filter(file => file.includes('.user.'));

	// Build standalone scripts
	const standalones = path.join(options.out, 'standalones');

	await Promise.allSettled(
		scripts
			.map(async file => {
				const outfile = path.join(
					standalones,
					path.relative(options.source, file),
				);
				const outdir = path.dirname(outfile);

				if (!await fse.isDirectory(outdir)) {
					await fs.mkdir(outdir, {recursive: true});
				}

				await bundle({
					entryPoints: [file],
					outfile,
				});

				const header = head((await fs.readFile(file, 'utf8')).toString());
				const transformed = (await fs.readFile(outfile, 'utf8')).toString();

				await fs.writeFile(outfile, header + '\n' + transformed, 'utf8');
			}),
	);

	// Build composed script
	const template = path.join(import.meta.url.replace('file:', ''), '../../assets/base.js');
	const outfile = path.join(options.out, options.name + '.user.js');
	const transformed = await Promise.all(
		scripts
			.map(async file => {
				const content = (await fs.readFile(file)).toString();
				const out = await build(
					(await fs.readFile(file)).toString(),
					{
						loader: file.split('.').pop() as Loader,
					},
				);

				return head(content) + '\n' + out;
			}),
	);

	const packed = await pack(
		(await fs.readFile(template)).toString(),
		{
			head: (await fs.readFile(options.header)).toString(),
			scripts: transformed,
		},
	);

	await fs.writeFile(outfile, packed, 'utf8');
};
