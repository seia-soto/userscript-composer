#!/usr/bin/env node
import cac from 'cac';
import * as build from './actions/build.js';

const cli = cac();

cli
	.option('--source [directory]', 'Set source directory to build', {
		default: 'scripts',
	})
	.option('--out [directory]', 'Set output directory for build', {
		default: 'dist',
	})
	.option('--header [file]', 'Set header file location to prepend', {
		default: 'header.txt',
	})
	.option('--name [name]', 'Set the name of complete user-script', {
		default: 'index',
	})
	.option('--minify', 'Minify the output for production use', {
		default: false,
	})
	.option('--clean', 'Clean the build directory before build', {
		default: false,
	});

cli
	.command('build', 'Bundle user-scripts to output directory')
	.action(build.action);

cli
	.version('0.0.1')
	.help();

cli.parse();
