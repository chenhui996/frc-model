// rollup.config.js
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import postcssImport from 'postcss-import';
import postcssNested from 'postcss-nested';
import postcssPresetEnv from 'postcss-preset-env';

import replace from '@rollup/plugin-replace';

export default {
	input: 'src/index.ts',
	output: {
		dir: 'dist',
		format: 'esm',
		name: 'myBundle'
	},
	plugins: [
		replace({
			preventAssignment: true,
			values: {
				// 替换所有的 `this` 关键字为 `window`
				this: 'window'
			}
		}),
		typescript({
			// 将 .d.ts 文件保存到指定目录
			tsconfigOverride: {
				compilerOptions: {
					declaration: true,
					allowSyntheticDefaultImports: true,
					jsx: "react",
					// target: 'es5',
				}
			}
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
	onwarn(warning, warn) {
		if (warning.code === 'UNRESOLVED_IMPORT') {
			return;
		} else {
			warn(warning);
		}
	}
};