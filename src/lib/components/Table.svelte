<script>
	import Icon from '@iconify/svelte';

	export let items;
	export let loading;
</script>

<div class="flex flex-col">
	<div class="overflow-x-auto">
		<div class="flex justify-between py-3 pl-2">
			<slot name="left_actions_2" />
			<slot name="right_actions_2" />
		</div>
		<div class="flex justify-between py-3 pl-2">
			<div class="relative max-w-xs">
				<slot name="left_actions" />
			</div>

			<div class="flex items-center space-x-2">
				<div class="relative">
					<slot name="right_actions" />
				</div>
			</div>
		</div>

		<div class="p-1.5 w-full inline-block align-middle overflow-x-auto">
			{#if loading}
				loading...
			{:else if items.length}
				<div class=" border rounded-lg">
					<slot name="table" />
				</div>
			{:else}
				<div class=" flex items-center justify-center">
					<Icon class=" text-yellow-900 text-8xl" icon="line-md:coffee-half-empty-twotone-loop" />
				</div>
				<div class=" flex items-center justify-center">Hmm...</div>
			{/if}
		</div>

		<div class="flex flex-row-reverse space-x-2 py-3 pl-2">
			<div class="relative">
				<slot name="right_submit" />
			</div>
		</div>
	</div>
</div>
