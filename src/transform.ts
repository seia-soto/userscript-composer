import esbuild from 'esbuild';

/**
 * Bundle the script source with its dependencies, you need to manually specify the in-out sources
 * @param additionalOptions Additional options to apply to esbuild
 */
export const bundle = async (additionalOptions: esbuild.BuildOptions) => {
	await esbuild.build({
		format: 'iife',
		platform: 'browser',
		treeShaking: true,
		bundle: true,
		...additionalOptions,
	});
};
