<script>
	import { signOut } from '@auth/sveltekit/client';
	import Navigation from './Navigation.svelte';
</script>

<nav class="navbar mb-2 flex lg:flex-row flex-col items-center max-w-[900px] m-0">
	<Navigation />
	<div>
		<button on:click={() => signOut()} class="button">Sign out</button>
	</div>
</nav>
