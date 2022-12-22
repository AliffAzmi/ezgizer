<script>
	import '../app.css';
	import Login from '$lib/components/Login.svelte';
	// import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
</script>

{#if $$props.data.isAuth}
	<div>
		<Sidebar />
		<!-- <Header /> -->
		<!-- class="flex flex-1 flex-col p-4 w-full max-w-5xl my-0 mx-auto box-border mt-10 md:mt-10 md:px-6" -->
		<main class="relative md:ml-64 bg-gray-100">
			<slot />
			<Footer />
		</main>
	</div>
{:else}
	<Login />
{/if}
