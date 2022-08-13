/**
 * The main reason to split this file with transform.ts is to divide the dependencies.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import {bundle} from './transform.js';
import {temporal} from './workdir.js';

/**
 * Inject user-script fragments into complete user-script
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
) => {
	const [workdir, remove] = await temporal();
	const sourceFile = path.join(workdir, 'packed.ts');
	const outFile = path.join(workdir, 'out.js');

	const packed = template
		.replace(
			// Consider build output of the esbuild
			'"__composer_positioner__scripts"',
			components.scripts
				.map(script => `()=>{${script}}`)
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
	});
	const out = await fs.readFile(outFile, 'utf8');

	await remove();

	return components.head + '\n' + out;
};
