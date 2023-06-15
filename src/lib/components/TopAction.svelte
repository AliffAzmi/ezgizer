<script>
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
	import { signOut } from '@auth/sveltekit/client';

	export let open;
	let userName = $page.data.session.user?.name;
	let userEmail = $page.data.session.user?.email;
</script>

<div
	class={`bg-white text-base float-left py-2 list-none text-left rounded shadow-lg min-w-48 absolute right-0 transition-all duration-200 ease-out ${
		open ? 'opacity-100 top-14 z-50' : 'opacity-0 top-12 z-0'
	}`}
>
	<div class="py-2 px-4">
		<div class=" text-sm font-bold">{userName}</div>
		<div class=" text-sm">{userEmail}</div>
	</div>

	<div class="h-0 my-2 border border-dashed border-gray-300" />

	<div class="flex items-center gap-2 py-2 px-4 hover:bg-gray-200 cursor-pointer">
		<Icon class=" w-5 h-6" icon="mingcute:user-4-line" />
		<a
			href="#nothingness"
			class="text-sm font-normal whitespace-nowrap bg-transparent text-gray-700">Profile</a
		>
	</div>
	<div class="flex items-center gap-2 py-2 px-4 hover:bg-gray-200 cursor-pointer">
		<Icon class=" w-5 h-6" icon="ep:setting" />
		<a
			href="#nothingness"
			class="text-sm font-normal whitespace-nowrap bg-transparent text-gray-700">Settings</a
		>
	</div>

	<div class="h-0 my-2 border border-dashed border-gray-300" />

	<div class="flex items-center gap-2 py-2 px-4 hover:bg-gray-200 cursor-pointer">
		<Icon class=" w-5 h-6" icon="mdi:sign-out" />
		<button
			class="text-sm font-normal whitespace-nowrap bg-transparent text-gray-700"
			on:click={() => signOut()}>Logout</button
		>
	</div>
</div>
