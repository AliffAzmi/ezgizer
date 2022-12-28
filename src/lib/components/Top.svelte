<script>
	import { signOut } from '@auth/sveltekit/client';
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';

	export let title;
	let openUserDropDown = false;
</script>

<nav
	class="top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4"
>
	<div
		class="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4"
	>
		<div class="text-sm uppercase hidden lg:inline-block font-semibold">{title}</div>

		<ul class="flex-col md:flex-row list-none items-center hidden md:flex">
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
				{#if openUserDropDown}
					<div
						class="bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48 absolute right-0"
					>
						<div class="flex items-center gap-2 py-2 px-4">
							<Icon class=" w-5 h-6" icon="ep:setting" />
							<a
								href="#nothingness"
								class="text-sm font-normal block w-full whitespace-nowrap bg-transparent text-gray-700"
								>Settings</a
							>
						</div>
						<div class="h-0 my-2 border border-solid border-gray-100" />

						<div class="flex items-center gap-2 py-2 px-4">
							<Icon class=" w-5 h-6" icon="mdi:sign-out" />
							<button
								class="text-sm font-normal block w-full whitespace-nowrap bg-transparent text-gray-700"
								on:click={() => signOut()}>Logout</button
							>
						</div>
					</div>
				{/if}
			</div>
		</ul>
	</div>
</nav>
