<script>
	import { signOut } from '@auth/sveltekit/client';
	import { page } from '$app/stores';
	import routes from '$lib/routes';
	import Icon from '@iconify/svelte';

	import TopAction from './TopAction.svelte';
	import ThemeSwitch from '$lib/ThemeSwitch/index.svelte';

	let openUserDropDown = false;
	let collapseShow = 'hidden';
	function toggleCollapseShow(classes) {
		collapseShow = classes;
	}
</script>

<nav
	class="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white dark:bg-slate-800 dark:border-r dark:border-gray-600 flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6"
>
	<div
		class="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto"
	>
		<!-- Toggler -->
		<button
			class="cursor-pointer text-black dark:text-white opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
			type="button"
			on:click={() => toggleCollapseShow('bg-white dark:bg-slate-800 py-3 px-6')}
		>
			<Icon class=" w-7 h-7" icon="uis:bars" />
		</button>
		<!-- Brand -->
		<a
			class="md:block text-left md:pb-2 text-gray-600 dark:text-slate-400 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
			href="/dashboard"
		>
			EzGizer
		</a>
		<!-- User -->
		<ul class="md:hidden items-center flex flex-wrap list-none">
			<li class="inline-block relative">
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
				<TopAction open={openUserDropDown} user={$page?.data?.user} />
			</li>
		</ul>

		<!-- Collapse -->
		<div
			class="md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-screen items-center flex-1 rounded {collapseShow}"
		>
			<!-- Collapse header -->
			<div class="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-gray-200">
				<div class="flex flex-wrap">
					<div class="w-6/12">
						<a
							class="md:block text-left md:pb-2 text-gray-600 dark:text-gray-400 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
							href="/"
						>
							EZGIZER
						</a>
					</div>
					<div class="w-6/12 flex justify-end">
						<button
							type="button"
							class="cursor-pointer text-black dark:text-white opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
							on:click={() => toggleCollapseShow('hidden')}
						>
							<Icon class=" w-7 h-7" icon="material-symbols:close-rounded" />
						</button>
					</div>
				</div>
			</div>

			<hr class="my-4 md:min-w-full hidden md:block" />

			<h6
				class="md:min-w-full text-gray-600 dark:text-gray-400 text-xs uppercase font-bold block pt-1 pb-4 no-underline"
			>
				Dashboard
			</h6>

			<ul class="md:flex-col md:min-w-full flex flex-col list-none">
				{#each routes as route}
					<li class="items-center" class:active={$page.url.pathname.includes(route.key)}>
						<a
							href={route.href}
							on:click={() => toggleCollapseShow('hidden')}
							class="text-xs uppercase py-3 font-bold block "
						>
							<div class=" flex items-center">
								<Icon class="mr-2 text-xl " icon={route.icon} />
								{route.label}
							</div>
						</a>
					</li>
				{/each}
			</ul>

			<hr class="my-4 md:min-w-full" />

			<ul class="md:flex-col md:min-w-full flex flex-between list-none">
				<li class="items-center w-full">
					<button on:click={() => signOut()} class="button">
						<span class="text-xs uppercase py-3 font-bold block ">
							<div class=" flex items-center">
								<Icon class="mr-2 text-xl " icon="mdi:sign-out" />
								Logout
							</div>
						</span>
					</button>
				</li>
				<li class="block lg:hidden md:hidden">
					<ThemeSwitch position={'sidebar'} />
				</li>
			</ul>
		</div>
	</div>
</nav>

<style>
	.active {
		@apply text-red-500;
	}
</style>
