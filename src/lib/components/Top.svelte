<script>
	import { page } from '$app/stores';
	import ThemeSwitch from '$lib/ThemeSwitch/index.svelte';
	import TopAction from './TopAction.svelte';

	export let title;
	let openUserDropDown = false;
</script>

<nav
	class="top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4"
>
	<div
		class="w-full mx-auto items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4"
	>
		<div class=" text-2xl uppercase hidden lg:inline-block font-semibold">{title}</div>

		<ul class="flex-col md:flex-row list-none items-center hidden md:flex gap-2">
			<ThemeSwitch />
			<div class=" relative">
				<div class="items-center flex">
					<button
						on:click={() => (openUserDropDown = !openUserDropDown)}
						class="w-12 h-12 text-sm text-white bg-gray-200 inline-flex items-center justify-center rounded-full"
					>
						<img
							alt="..."
							class="w-full rounded-full align-middle border-none shadow-lg"
							src={$page.data.session.user.image || 'http://source.unsplash.com/800x800/?tree'}
						/>
					</button>
				</div>
				<TopAction open={openUserDropDown} />
			</div>
		</ul>
	</div>
</nav>
