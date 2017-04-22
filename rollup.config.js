import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import alias from 'rollup-plugin-alias';
import builtins from 'rollup-plugin-node-builtins';
import uglify from 'rollup-plugin-uglify';
import globals from 'rollup-plugin-node-globals';
import replace from 'rollup-plugin-replace';

export default {
	entry: './game.js',
	dest: './dist/game.js',
	plugins: [
		alias({
			'pixi.js': 'node_modules/pixi.js/src/index.js',
		}),
		babel({
			babelrc: false,
			presets: [
				['env', {
					'targets': {
						'browsers': ['last 2 versions']
					},
					'modules': false,
					'loose': true
				}]
			],
			plugins: ['static-fs', 'version-inline', 'external-helpers'],
			externalHelpers: true
		}),
		nodeResolve({ 
			jsnext: true,
			main: true,
			browser: true
		}),
		commonjs({
			ignoreGlobal: false,
			namedExports: {
				'node_modules/pixi-gl-core/src/index.js': ['createContext', 'setVertexAttribArrays', 'GLBuffer',
													'GLFramebuffer', 'GLShader', 'GLTexture', 'VertexArrayObject', 'shader'],
				'node_modules/resource-loader/lib/index.js': ['Loader', 'Resource', 'async', 'base64' ],
			}
		}),
		builtins(),
		globals(),
		replace({
			'typeof deprecation === \'function\'': 'false',
			'.PIXI = exports': ''
		}),
		uglify()
	],
	format: 'iife'
}
