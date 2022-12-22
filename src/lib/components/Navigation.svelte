<script>
	import { page } from '$app/stores';

	import routes from '$lib/routes';
</script>

<div class="flex-1 px-2 mx-2 lg:flex">
	<div class="flex items-stretch">
		{#each routes as route}
			<a
				class:active={$page.url.pathname.includes(route.href)}
				class="btn btn-ghost btn-sm rounded-btn p-0 m-3"
				href={route.href}
			>
				{route.label}
			</a>
		{/each}
	</div>
</div>
