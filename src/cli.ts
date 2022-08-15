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
	.command('build', 'Build each user-scripts to output directory using source directory structure')
	.action(actions.build.action);

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
	.version('0.0.5')
	.help();

cli.parse();
