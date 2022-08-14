import fs from 'node:fs/promises';
import {Loader} from 'esbuild';
import * as transformer from '../transformer.js';
import * as userscript from '../userscript.js';
import * as packer from '../packer.js';
import {IScript} from '../types';

export interface IUnifiedBuildOptions {
	template: string,
	header: string,
	scripts: IScript[],
  minify: boolean,
}

/**
 * Build unified user-script
 * @param options Components to compile unified user-script and optional paramemters to postprocess the output
 * @returns Unified user-script payload
 */
export const build = async (options: IUnifiedBuildOptions) => {
	const inlineBatches = options.scripts.map(async script => {
		const out = await transformer.build(
			script.content,
			{
				loader: script.path.split('.').pop() as Loader,
			},
		);

		return userscript.head(script.content) + '\n' + out;
	});

	const inlines = await Promise.all(inlineBatches);
	const unified = await packer.pack(
		options.template,
		{
			head: options.header,
			scripts: inlines,
		},
		options,
	);

	return unified;
};

/**
 * Build and save unified user-script
 * @param out The output path to unified user-script
 * @param options Components to compile unified user-script and optional paramemters to postprocess the output
 */
export const unify = async (out: string, options: IUnifiedBuildOptions) => {
	const unified = await build(options);

	await fs.writeFile(out, unified, 'utf8');
};
