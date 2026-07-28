import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import viteCompression from "vite-plugin-compression";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	base: "",
	publicDir: false,
	build: {
		manifest: true,
		outDir: "dist",
		assetsDir: "src",
	},
	plugins: [
		tailwindcss(),
		laravel({
			publicDirectory: "dist",
			input: [
				"src/stylesheets/styles.css",
				"src/stylesheets/editor.css",
				"src/scripts/main.ts",
			],
			refresh: ["**/*.php", "**/*.twig"],
		}),
		viteCompression(),
	],
	resolve: {
		alias: [
			{
				find: "scripts",
				replacement: path.resolve(__dirname, "src/scripts"),
			},
			{
				find: "stylesheets",
				replacement: path.resolve(__dirname, "src/stylesheets"),
			},
		],
	},
});
