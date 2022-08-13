/**
 * The main reason to split this file with transform.ts is to divide the dependencies.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import picomatch from 'picomatch';
import {compress} from './compressor.js';
import {build, bundle} from './transform.js';
import {head, parse, stringify} from './userscript.js';
import {temporal} from './workdir.js';

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
	minify: boolean,
) => {
	// Head
	const config = parse(components.head);

	config.match ??= [];

	if (typeof config.match === 'string') {
		config.match = [config.match];
	}

	// Body
	const [workdir, remove] = await temporal();
	const sourceFile = path.join(workdir, 'packed.ts');
	const outFile = path.join(workdir, 'out.js');

	const packed = template
		.replace(
			// Consider build output of the esbuild
			'"__composer_positioner__scripts"',
			(
				await Promise.all(
					components.scripts
						.map(async script => {
							// Get matches
							const header = parse(head(script));
							let matches: string | string[] = header.match ?? '';

							if (typeof matches === 'string') {
								matches = [matches];
							}

							const patterns = matches
								.map(match => {
									if ((config.match as string[]).indexOf(match) < 0) {
										(config.match as string[]).push(match);
									}

									// To reach the accuracy of userscript managers, might need to implement own builder.
									const matcher = picomatch
										.makeRe(match, {
											dot: true,
											regex: true,
											strictSlashes: true,
										})
										.toString()
										// Replace manual slashes at the front and back
										.slice(1, -1)
										// Allow zero width for star (*)
										.replace(/\(\?=\.\)/g, '(?=.?)');

									return new RegExp(matcher);
								})
								.join(',');

							// Build
							const transformed = await build(script, {
								target: 'es2022',
							});

							return `{matches: [${patterns}],fx:()=>{${transformed}}}`;
						}),
				)
			)
				.join(','),
		);

	await fs.writeFile(sourceFile, packed, 'utf8');
	await bundle({
		entryPoints: [
			sourceFile,
		],
		outfile: outFile,
		external: [
			'path', // Fix for picomatch
		],
		minify,
	});
	const out = await fs.readFile(outFile, 'utf8');
	const minified = minify
		? await compress(out, {})
		: out;

	await remove();

	return stringify(config) + '\n' + minified;
};
