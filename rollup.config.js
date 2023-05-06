// rollup.config.js
import babel from '@rollup/plugin-babel';
import typescript from 'rollup-plugin-typescript2';

import postcss from 'rollup-plugin-postcss';
import postcssImport from 'postcss-import';
import postcssNested from 'postcss-nested';
import postcssPresetEnv from 'postcss-preset-env';

export default {
	input: 'src/index.ts',
	output: {
		dir: 'dist',
		format: 'esm',
		name: 'myBundle'
	},
	plugins: [
		typescript({
			// 将 .d.ts 文件保存到指定目录
			tsconfigOverride: {
				compilerOptions: {
					declaration: true,
					allowSyntheticDefaultImports: true,
					jsx: "react"
				}
			}
		}),
		babel({
			babelHelpers: 'bundled',
			exclude: 'node_modules/**' // 只编译我们的源代码
		}),
		postcss({
			extract: true,
			minimize: true,
			extract: 'style/global.css', // 指定CSS文件的位置
			plugins: [
				postcssImport(),
				postcssNested(),
				postcssPresetEnv()
			]
		})
	],
};