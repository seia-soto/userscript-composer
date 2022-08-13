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
		external: ['fs', 'path'],
		...additionalOptions,
	});
};

/**
 * Build the script to compose with other scripts
 * @param source The source script
 * @param additionalOptions Additional options to apply to esbuild
 */
export const build = async (source: string, additionalOptions: esbuild.TransformOptions) => {
	const built = await esbuild.transform(source, {
		// Use cjs to avoid top level import
		format: 'cjs',
		platform: 'browser',
		treeShaking: true,
		...additionalOptions,
	});

	return built.code;
};
