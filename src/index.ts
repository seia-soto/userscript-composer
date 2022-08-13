import cac from 'cac';

const cli = cac();

cli
	.command('build', 'Bundle user-scripts to output directory');

cli
	.option('--source [directory]', 'Set source directory to build', {
		default: 'scripts',
	})
	.option('--out [directory]', 'Set output directory for build', {
		default: 'dist',
	});

cli
	.version('0.0.1')
	.help();
