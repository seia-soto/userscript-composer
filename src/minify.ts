import {minify, MinifyOptions} from 'terser';

/**
 * Minify and compress safely using terser
 * @param source The source script to minify
 * @param additionalOptions Additional options to be applied to terser
 * @returns The minified source
 */
export const process = async (source: string, additionalOptions: MinifyOptions) => {
	/* eslint-disable camelcase */
	const {code} = await minify(source, {
		compress: {
			arrows: true,
			booleans: true,
			booleans_as_integers: false,
			collapse_vars: false,
			comparisons: true,
			computed_props: true,
			conditionals: true,
			dead_code: true,
			directives: true,
			drop_console: false,
			drop_debugger: false,
			ecma: 5,
			evaluate: true,
			expression: true,
			hoist_funs: false,
			hoist_props: true,
			hoist_vars: true,
			if_return: false,
			inline: 0,
			join_vars: true,
			keep_classnames: false,
			keep_fargs: true,
			keep_fnames: false,
			keep_infinity: false,
			loops: true,
			module: false,
			negate_iife: true,
			passes: 2,
			properties: true,
			reduce_vars: true,
			sequences: true,
			side_effects: true,
			switches: true,
			toplevel: false,
			typeofs: true,
			unsafe: false,
			unused: true,
		},
		mangle: {
			eval: true,
			keep_classnames: false,
			keep_fnames: false,
			module: false,
			toplevel: false,
			safari10: true,
		},
		...additionalOptions,
	});
	/* eslint-enable camelcase */

	// Give some fallbacks
	return code ?? source;
};
