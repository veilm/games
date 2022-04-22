svelte-ts: Template for Svelte + TypeScript

Installation
	tmpl svelte-ts my-project-name
	cd my-project-name

Running dev version
	npm run dev
	You'll have it running at localhost:8080

TypeScript
	I already ran Svelte's conversion script; the current files use TypeScript.
	- Use ``<script lang="ts">`` instead of ``<script>``
	- Use ``npx svelte-check`` / ``npx run check`` to check TypeScript messages.

	I'm not sure how to make it so that npm run dev automatically checks for Svelte
	errors and TypeScript errors at the same time. I guess my workflow will be
	writing in what I think is TypeScript without checking that it's valid until I
	either have to git commit or run into a bug.

Prod version
	"In the last step were running the app in 'development mode'. In dev mode,
	Svelte adds extra code that helps with debugging, and Rollup skips the final
	step where your app's JavaScript is compressed using Terser. When you share
	your app with the world, you want to build it in 'production mode', so that
	it's as small and efficient as possible for end users. To do that, use the
	build command: npm run build"

	You can run this build: npm run start

Reading
	https://svelte.dev
	https://github.com/sveltejs/template
	https://svelte.dev/blog/the-easiest-way-to-get-started
	https://svelte.dev/blog/svelte-for-new-developers
