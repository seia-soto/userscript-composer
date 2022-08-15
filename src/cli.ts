#!/usr/bin/env node
import cac from 'cac';
import * as actions from './actions/index.js';

const cli = cac();

cli
	.option('--source [directory]', 'Set source directory to build', {
		default: 'scripts',
	})
	.option('--out [directory]', 'Set output directory for build', {
		default: 'dist',
	})
	.option('--minify', 'Minify the output for production use', {
		default: false,
	})
	.option('--clean', 'Clean the build directory before build', {
		default: false,
	});

cli
	.command('init', 'Setup new userscript-composer project')
	.action(actions.init.action);

cli
	.command('build', 'Build an user-scripts to output file')
	.option('--source [file]', 'Set source file to build', {
		default: 'scripts/index.user.js',
	})
	.option('--out [file]', 'Set output file for build', {
		default: 'dist/index.user.js',
	})
	.action(actions.build.action);

cli
	.command('batch', 'Batch build each user-scripts to output directory using source directory structure')
	.action(actions.batch.action);

cli
	.command('unify', 'Bundle full of user-scripts to output directory')
	.option('--name [name]', 'Set the name of complete user-script', {
		default: 'index',
	})
	.option('--header [file]', 'Set header file location to prepend', {
		default: 'header.txt',
	})
	.action(actions.unify.action);

cli
	.version('0.0.6')
	.help();

cli.parse();
