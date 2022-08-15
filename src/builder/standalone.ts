import fs from 'node:fs/promises';
import path from 'node:path';
import * as compressor from '../compressor.js';
import * as packer from '../packer.js';
import {IScript} from '../types';
import * as userscript from '../userscript.js';
import * as fse from '../utils/fse.js';

export interface IStandaloneOptions {
  minify: boolean
}

/**
 * Build standalone user-script bundled with its header and dependencies
 * @param script The source script objet
 * @param options Optional parameters to postprocess build output
 * @returns Standalone user-script with proper header
 */
export const build = async (
	script: IScript,
	options: IStandaloneOptions,
) => {
	const header = userscript.head(script.content);
	const transformed = await packer.batch(script.content, {});
	const compressed = await compressor.conditional(options.minify, transformed);

	return header + '\n' + compressed;
};

/**
 * Calculate user-script output path and create all parent directories if required
 * @param filepath Path to script file including source directory
 * @param source The source directory
 * @param out The output directory
 * @returns The path to output user-script
 */
export const shim = async (
	filepath: string,
	source: string,
	out: string,
) => {
	const outfile = path.join(
		out,
		[
			...path
				.relative(source, filepath)
				.split('.')
				.slice(0, -1),
			'js',
		].join('.'),
	);
	const outdir = path.dirname(outfile);

	if (!await fse.isDirectory(outdir)) {
		await fs.mkdir(outdir, {recursive: true});
	}

	return outfile;
};

export interface IStandaloneBatchOptionsHint {
  source: string,
  out: string,
  minify: boolean
}

/**
 * Batch bundle standalone scripts
 * @param scripts The array of script objets
 * @param options Optional parameters to postprocess the build output
 */
export const batch = async (
	scripts: IScript[],
	options: IStandaloneBatchOptionsHint,
) => {
	const batches = scripts
		.map(async script => {
			const where = await shim(script.path, options.source, options.out);
			const what = await build(script, options);

			await fs.writeFile(
				where,
				what,
				'utf8',
			);
		});

	await Promise.all(batches);
};
