<script>
	import Icon from '@iconify/svelte';
	import Table from '$lib/components/Table.svelte';
	import categories from '$lib/data/categories';
	import Top from '$lib/components/Top.svelte';
</script>

<svelte:head>
	<title>Categories | Ezgizer</title>
</svelte:head>

<Top title={'Categories'} />

<div class="px-4 md:px-10 mx-auto w-full">
	<Table items={categories}>
		<div slot="right_actions">
			<button
				class="relative z-0 inline-flex text-sm rounded-md shadow-sm focus:ring-accent-500 focus:border-accent-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1"
			>
				<span
					class="relative inline-flex items-center px-3 py-3 space-x-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md sm:py-2"
				>
					<Icon class=" w-4 h-4" icon="material-symbols:add" />
				</span>
			</button>
		</div>

		<table slot="table" class="min-w-full divide-y divide-gray-200">
			<thead class="bg-gray-50">
				<tr>
					<th scope="col" class="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase " />
					<th scope="col" class="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
						Name
					</th>
					<th scope="col" class="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase ">
						Actions
					</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200">
				{#each categories as item, i}
					<tr>
						<td class="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
							{i + 1}
						</td>
						<td class="px-6 py-4 text-sm text-gray-800 whitespace-nowrap"> {item.name} </td>
						<td class="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
							<button>
								<Icon
									class=" w-6 h-6 text-gray-500 hover:text-gray-700"
									icon="material-symbols:edit-outline-sharp"
								/>
							</button>
							<button>
								<Icon
									class=" w-6 h-6 text-gray-500 hover:text-red-700"
									icon="ic:round-delete-outline"
								/></button
							>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</Table>
</div>
