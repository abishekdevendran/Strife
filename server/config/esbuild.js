const { build } = require('esbuild');

build({
	entryPoints: ['dist/index.js'],
	minify: true,
	bundle: true,
	platform: 'node',
	outfile: 'dist/build.js',
})
	.then(() => console.log('Build Complete!🎉'))
	.catch(() => {
		console.error('Build failed 😿');
		process.exit(1);
	});
