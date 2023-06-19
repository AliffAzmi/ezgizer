<script>
	import Icon from '@iconify/svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import { onMount } from 'svelte';

	import Table from '$lib/components/Table.svelte';
	import Top from '$lib/components/Top.svelte';
	import Modal from '$lib/components/Modal.svelte';

	// import categories from '$lib/data/categories';

	let categories = [];
	let showModal = false;
	let actionLabel = 'Add new';
	$: selectedCategory = {};

	onMount(async () => {
		await getCategories();
	});

	const getCategories = async () => {
		const categoriesData = await fetch('/api/categories', { method: 'GET' });
		const cats = await categoriesData.json();
		categories = cats?.category || [];
	};

	const handleUpsert = (action, item) => {
		actionLabel = action;
		showModal = true;
		selectedCategory = item;
	};
	const handleSubmit = async (e) => {
		try {
			const formData = new FormData(e.target);
			const data = {};
			for (let field of formData) {
				const [key, value] = field;
				data[key] = value;
			}
			if (data.id) {
				await fetch(`/api/categories/${selectedCategory._id}`, {
					method: 'POST',
					body: JSON.stringify(data)
				});
			} else {
				data.value = data.name.trim().toLowerCase();
				await fetch('/api/categories', {
					method: 'POST',
					body: JSON.stringify(data)
				});
			}
			toast.success(`Category ${actionLabel}`);
			showModal = false;
			await getCategories();
		} catch (error) {
			toast.error('Something went wrong. Please try again.');
		}
	};
	const handleDelete = async (item) => {
		if (confirm('Are you sure to delete this category? Category deleted is not recovered.')) {
			await fetch(`/api/categories/${item._id}`, {
				method: 'DELETE'
			});
			toast.success('Item deleted');
			await getCategories();
		}
	};
</script>

<svelte:head>
	<title>Categories | Ezgizer</title>
</svelte:head>

<Top title={'Categories'} />
<Toaster />

<div class="px-4 md:px-10 mx-auto w-full">
	<Table items={categories}>
		<div slot="right_actions">
			<button
				on:click={() => handleUpsert('Add', {})}
				class="relative z-0 inline-flex text-sm rounded-md shadow-sm focus:ring-accent-500 focus:border-accent-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1"
			>
				<span
					class="relative inline-flex items-center px-3 py-3 space-x-2 text-sm font-medium text-gray-600 dark:text-white bg-white dark:bg-slate-700 border border-gray-300 rounded-md sm:py-2"
				>
					<Icon class=" w-4 h-4" icon="material-symbols:add" />
				</span>
			</button>
		</div>

		<table
			slot="table"
			class="min-w-full divide-y divide-gray-200 dark:divide-gray-500 bg-white dark:bg-slate-700"
		>
			<thead>
				<tr>
					<th
						scope="col"
						class="px-6 py-3 text-xs font-bold text-left text-gray-500 dark:text-white uppercase "
					/>
					<th
						scope="col"
						class="px-6 py-3 text-xs font-bold text-left text-gray-500 dark:text-white uppercase "
					>
						Name
					</th>
					<th
						scope="col"
						class="px-6 py-3 text-xs font-bold text-right text-gray-500 dark:text-white uppercase "
					>
						Actions
					</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200 dark:divide-gray-500">
				{#each categories as item, i}
					<tr>
						<td
							class="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white whitespace-nowrap"
						>
							{i + 1}
						</td>
						<td class="px-6 py-4 text-sm text-gray-800 dark:text-white whitespace-nowrap">
							{item.name}
						</td>
						<td class="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
							<button on:click={() => handleUpsert('Edit', item)}>
								<Icon
									class=" w-6 h-6 text-blue-500 hover:text-blue-700"
									icon="material-symbols:edit-outline-sharp"
								/>
							</button>
							<button on:click={() => handleDelete(item)}>
								<Icon
									class=" w-6 h-6 text-red-500 hover:text-red-700"
									icon="ic:round-delete-outline"
								/>
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</Table>
</div>

<Modal title={`${actionLabel} category`} open={showModal} on:close={() => (showModal = false)}>
	<svelte:fragment slot="body">
		<form on:submit|preventDefault={handleSubmit}>
			<div class="flex flex-wrap -mx-3 mb-6">
				<div class="w-full flex-grow md:w-1/2 px-3 mb-6 md:mb-0">
					<label
						class="block uppercase tracking-wide text-gray-700 dark:text-white text-xs font-bold mb-2"
						for="name"
					>
						Name
					</label>
					<input
						class="appearance-none block w-full bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-white border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
						name="name"
						type="text"
						required
						value={selectedCategory?.name ? selectedCategory.name : ''}
					/>
					<input
						type="text"
						name="id"
						class="hidden"
						value={selectedCategory?._id ? selectedCategory._id : ''}
					/>
					<input
						type="text"
						name="value"
						class="hidden"
						value={selectedCategory?.value ? selectedCategory.value : ''}
					/>
				</div>
			</div>

			<div class="flex flex-row-reverse">
				<button
					type="submit"
					class="inline-flex justify-center rounded-md border border-transparent bg-gray-600 text-white hover:bg-gray-800 py-2 px-4 text-sm font-medium shadow-sm"
					>{actionLabel}</button
				>
			</div>
		</form>
	</svelte:fragment>
</Modal>
