/**
 * The main reason to split this file with transform.ts is to divide the dependencies.
 */
import type {BuildOptions} from 'esbuild';
import fs from 'node:fs/promises';
import path from 'node:path';
import picomatch from 'picomatch';
import * as compressor from './compressor.js';
import * as transformer from './transformer.js';
import * as userscript from './userscript.js';
import {temporal} from './workdir.js';

/**
 * Transform style bundle API
 * @param source The source script
 * @param additionalOptions Additional options to be applied to esbuild
 * @returns Bundled script with dependencies
 */
export const batch = async (
	source: string,
	additionalOptions: BuildOptions,
) => {
	const [location, remove] = await temporal();
	const from = path.join(location, 'source.ts');
	const to = path.join(location, 'to.js');

	await fs.writeFile(from, source, 'utf8');
	await transformer.bundle({
		entryPoints: [
			from,
		],
		outfile: to,
		...additionalOptions,
	});

	const content = await fs.readFile(to, 'utf8');

	await remove();

	return content;
};

/**
 * Patternize glob pattern to regular expression using picomatch
 * @param matches Match fields in user-script header
 * @returns A stringified array of regular expressions to be embeded
 */
export const patternize = async (matches: string[]) => {
	const inline = matches
		.map(match => {
			// To reach the accuracy of userscript managers, might need to implement own builder.
			const matcher = picomatch
				.makeRe(match, {
					dot: true,
					regex: true,
					nonegate: true,
					strictSlashes: true,
				})
				.toString()
				// Allow zero width for star (*)
				.replace(/\(\?=\.\)/g, '(?=.?)');

			return matcher;
		})
		.join(',');

	return '[' + inline + ']';
};

export interface IPackingOptions {
	minify: boolean
}

/**
 * Inject JavaScript version of user-script fragments into complete user-script
 * @param template The template script to be injected
 * @param components The components to compose with template script
 * @returns The complete user-script packed with components
 */
export const pack = async (
	template: string,
	components: {
    head: string,
    scripts: string[],
  },
	options: IPackingOptions,
) => {
	// Head
	const config = userscript.parse(components.head);

	config.match ??= [];

	if (typeof config.match === 'string') {
		config.match = [config.match];
	}

	const embedBatchs = components.scripts.map(async script => {
		const header = userscript.parse(userscript.head(script));
		let matches: string | string[] = header.match ?? '';

		if (typeof matches === 'string') {
			matches = [matches];
		}

		// Shim global matches
		for (const match of matches) {
			if ((config.match as string[]).indexOf(match) < 0) {
				(config.match as string[]).push(match);
			}
		}

		const transformed = await transformer.build(script, {
			target: 'es2022',
		});

		return `{matches: ${patternize(matches)},fx:()=>{${transformed}}}`;
	});
	const embed = await Promise.all(embedBatchs);

	const embeded = template.replace(
		// Consider build output of the esbuild
		'"__composer_positioner__scripts"',
		embed.join(','),
	);

	const packed = await batch(embeded, {});
	const minified = await compressor.conditional(options.minify, packed);

	return userscript.stringify(config) + '\n' + minified;
};
