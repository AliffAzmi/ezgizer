<script>
	import { browser } from '$app/environment';
	import { theme } from '$lib/stores';
	export let position;
	let darkMode = true;

	const handleSwitchDarkMode = () => {
		darkMode = !darkMode;

		localStorage.setItem('theme', darkMode ? 'dark' : 'light');
		theme.set(darkMode ? 'dark' : 'light');

		darkMode
			? document.documentElement.classList.add('dark')
			: document.documentElement.classList.remove('dark');
	};

	theme.subscribe((value) => {
		if (browser) {
			if (
				localStorage.theme === 'dark' ||
				(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
			) {
				document.documentElement.classList.add('dark');
				darkMode = true;
				theme.set('dark');
			} else {
				document.documentElement.classList.remove('dark');
				darkMode = false;
				theme.set('light');
			}
		}
	});
</script>

<div class="items-center flex">
	<input checked={darkMode} on:click={handleSwitchDarkMode} type="checkbox" id="theme-toggle" />
	<label for="theme-toggle" class={position === 'sidebar' ? 'h-8 w-8' : 'h-12 w-12'} />
</div>

<style lang="postcss">
	#theme-toggle {
		@apply invisible;
	}

	#theme-toggle + label {
		/* @apply inline-block cursor-pointer h-12 w-12 absolute top-6 right-24 rounded-full duration-300 content-['']; */
		@apply inline-block cursor-pointer rounded-full duration-300 content-[''];
	}

	#theme-toggle:not(:checked) + label {
		@apply bg-amber-400;
	}

	#theme-toggle:checked + label {
		@apply bg-transparent;
		box-shadow: inset -12px -10px 1px 1px #ddd;
	}
</style>
