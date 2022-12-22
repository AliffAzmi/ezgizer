<script>
	import { signOut } from '@auth/sveltekit/client';
	import { page } from '$app/stores';
	import routes from '$lib/routes';
	import Icon from '@iconify/svelte';

	let collapseShow = 'hidden';
	function toggleCollapseShow(classes) {
		collapseShow = classes;
	}
</script>

<nav
	class="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6"
>
	<div
		class="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto"
	>
		<!-- Toggler -->
		<button
			class="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
			type="button"
			on:click={() => toggleCollapseShow('bg-white m-2 py-3 px-6')}
		>
			<Icon icon="uis:bars" />
		</button>
		<!-- Brand -->
		<a
			class="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
			href="#/"
		>
			EzGizer
		</a>
		<!-- User -->
		<ul class="md:hidden items-center flex flex-wrap list-none">
			<li class="inline-block relative" />
			<li class="inline-block relative" />
		</ul>
		<!-- Collapse -->
		<div
			class="md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-screen items-center flex-1 rounded {collapseShow}"
		>
			<!-- Collapse header -->
			<div
				class="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200"
			>
				<div class="flex flex-wrap">
					<div class="w-6/12">
						<!--  -->
						<a
							class="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
							href="/"
						>
							Notus Svelte
						</a>
					</div>
					<div class="w-6/12 flex justify-end">
						<button
							type="button"
							class="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
							on:click={() => toggleCollapseShow('hidden')}
						>
							<Icon icon="material-symbols:close-rounded" />
						</button>
					</div>
				</div>
			</div>

			<form class="mt-6 mb-4 md:hidden">
				<div class="mb-3 pt-0">
					<input
						type="text"
						placeholder="Search"
						class=" px-3 py-2 h-12 border border-solid border-blueGray-500 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-base leading-snug shadow-none outline-none focus:outline-none w-full font-normal"
					/>
				</div>
			</form>

			<hr class="my-4 md:min-w-full" />

			<h6
				class="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline"
			>
				Dashboard
			</h6>

			<ul class="md:flex-col md:min-w-full flex flex-col list-none">
				{#each routes as route}
					<li class="items-center" class:active={$page.url.pathname.includes(route.href)}>
						<a href={route.href} class="text-xs uppercase py-3 font-bold block ">
							<div class=" flex items-center">
								<Icon class="mr-2 text-xl " icon={route.icon} />
								{route.label}
							</div>
						</a>
					</li>
				{/each}
			</ul>

			<hr class="my-4 md:min-w-full" />

			<ul class="md:flex-col md:min-w-full flex flex-col list-none">
				<li class="items-center">
					<button on:click={() => signOut()} class="button">
						<span class="text-xs uppercase py-3 font-bold block ">
							<div class=" flex items-center">
								<Icon class="mr-2 text-xl " icon="mdi:sign-out" />
								Logout
							</div>
						</span>
					</button>
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
