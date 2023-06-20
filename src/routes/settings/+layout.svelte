<script>
	import { page } from '$app/stores';
	import Top from '$lib/components/Top.svelte';

	export let data;

	$: activeSection = $page.url.pathname.includes('profile') ? 'profile' : 'general';
</script>

<svelte:head>
	<title>Settings - {activeSection} | Ezgizer</title>
</svelte:head>

<Top title={'Settings'} />

<div class="px-4 md:px-10 mx-auto w-full">
	<div class="border-b border-gray-200 dark:border-gray-700 mb-4">
		<ul class="flex flex-wrap -mb-px">
			{#each data.sections as section}
				<li class={section.sort === 1 ? 'mr-2' : ''} role="presentation">
					<a
						href={section.href}
						on:click={() => (activeSection = section.slug)}
						class:active={$page.url.pathname.includes(section.slug)}
						class="inline-block text-gray-500 hover:text-gray-600 hover:border-gray-300 rounded-t-lg py-4 px-4 text-sm font-medium text-center border-transparent border-b-2 dark:text-gray-400 dark:hover:text-gray-300"
						id="settings-tab"
						data-tabs-target="#settings"
						type="button"
						role="tab"
						aria-controls="settings"
						aria-selected="false"
						>{section.title}
					</a>
				</li>
			{/each}
		</ul>
	</div>

	<slot />
</div>

<style>
	.active {
		@apply text-red-500 border-b-2 border-red-500;
	}
</style>
