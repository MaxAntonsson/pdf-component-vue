import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import topLevelAwait from 'vite-plugin-top-level-await'

import * as packageJson from './package.json'

const packageName = packageJson.name

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		lib: {
			entry: resolve('src', 'components/index.js'),
			name: packageName,
			formats: ['es'],
			fileName: (format) => `${packageName}.${format}.js`,
		},
		rollupOptions: {
			external: [...Object.keys(packageJson.peerDependencies)],
			output: {
				globals: { vue: "vue" }
			}
		},
	},
	define: {
		__APP_VERSION__: JSON.stringify(packageJson.version)
	},
	plugins: [
		vue(),
		topLevelAwait()
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	}
})
