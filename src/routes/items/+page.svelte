<script>
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import Flatpickr from 'svelte-flatpickr';
	// import flatpickr from 'flatpickr';
	import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect';
	import Table from '$lib/components/Table.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import Top from '$lib/components/Top.svelte';
	import dataCategories from '$lib/data/categories.js';

	import 'flatpickr/dist/flatpickr.css';
	import 'flatpickr/dist/plugins/monthSelect/style.css';

	$: items = [];
	$: selectedItems = [];
	let selected = new Set();
	let showModal = false;
	let showItemModal = false;
	let upsertLabel = 'Create';
	let refresh = false;
	let period = {};
	let instances = {};
	let options = {
		inline: true,
		mode: 'range',
		plugins: [
			new monthSelectPlugin({
				shorthand: true,
				dateFormat: 'm-Y',
				altFormat: 'F Y'
				// theme: 'dark'
			})
		],
		onChange(selectedDates, dateStr, instance) {
			instances = instance;
			if (selectedDates.length > 1) {
				var range =
					instance.formatDate(selectedDates[1], 'U') - instance.formatDate(selectedDates[0], 'U');
				range = range / 86400;

				if (range > 62) {
					alert(
						"You've exceed limit plan. Your maximum selection is 3 months period. Please upgrade to enjoy!"
					);
					removeCalendarSelection();
				}
			}
			period = {
				selectedDates,
				dateStr,
				period_from: selectedDates.length
					? selectedDates[0].toLocaleString('en-US', { month: 'short', year: 'numeric' })
					: '',
				period_to:
					dateStr.includes('to') && selectedDates
						? selectedDates[1].toLocaleString('en-US', { month: 'short', year: 'numeric' })
						: ''
			};
		}
	};

	onMount(async () => {
		await getItems();
		getCategories();
	});

	const removeCalendarSelection = () => {
		instances.config && instances.clear();
		document.querySelectorAll('span.flatpickr-monthSelect-month').forEach((s) => {
			s.classList.remove('selected');
			s.classList.remove('startRange');
			s.classList.remove('inRange');
			s.classList.remove('endRange');
		});
	};

	const getCategories = async () => {
		let newItems = [];
		if (items) {
			newItems = await Promise.all(
				items.map(async (list) => {
					const response = await fetch(`/api/categories?value=${list.category}`, {
						method: 'GET'
					});
					const payload = await response.json();
					if (payload.category) {
						list.category_name = payload.category.name;
					}
					return list;
				})
			);
		}
		items = newItems;
	};

	const getItems = async () => {
		const user_id = '1a012aadd';
		const response = await fetch(`/api/items?user_id=${user_id}`, {
			method: 'GET'
		});
		const payload = await response.json();
		if (payload?.items) {
			items = payload?.items;
		}
	};

	const handleToggleAll = (event, newItems) => {
		if (event.target.checked) {
			selected = new Set(items.map((item) => item._id));
			selectedItems = newItems;
		} else {
			selected.clear();
			selectedItems = [];
		}
		selected = selected;
	};

	const handleToggleOne = (event, newItem) => {
		if (event.target.checked) {
			selected.add(event.target.value);
			selectedItems.push(newItem);
		} else {
			selected.delete(event.target.value);
			selectedItems = [...selectedItems.filter((it) => it.name !== newItem.name)];
		}
		selected = selected;
	};

	const handleSubmit = async () => {
		if (period.dateStr.includes('to')) {
			// build loop year to duplicate
		} else {
			const itemsData = {};
			itemsData.user_id = '1a012aadd';
			itemsData.month_year = period.dateStr;
			itemsData.items = selectedItems;

			try {
				await fetch('/api/utilities', {
					method: 'POST',
					body: JSON.stringify(itemsData)
				});
				toast.success('Items duplicated to your selection period');
				selected = [];
				showModal = false;
			} catch (error) {
				toast.error('Something went wrong. Please try again.');
			}
		}
	};

	const handleUpsertItem = (e) => {
		const formData = new FormData(e.target);

		const data = {};
		data.status = 0;
		data.recurring = 0;
		for (let field of formData) {
			const [key, value] = field;
			data[key] = key === 'recurring' || key === 'status' ? parseInt(value) : value;
		}
		items[data?.idx ? data.idx - 1 : items.length] = data;
		showItemModal = false;
		toast('Please click save button to save your changes!', {
			icon: '🚨'
		});
	};

	const handleToggleModal = (label, index) => {
		upsertLabel = label ? label : 'Create';
		if (label === 'Update') {
			selectedItems = items.find((item, idx) => idx + 1 === index);
			selectedItems.index = index;
		} else {
			selectedItems = {};
		}
		showItemModal = !showItemModal;
	};
	const handleRemoveItem = async (id) => {
		if (confirm('Are you sure to delete this item? Item deleted is not recovered.')) {
			items = items.filter((item, index) => item._id !== id);
			await fetch(`/api/items/${id}`, {
				method: 'DELETE'
			});
			toast.success('Item deleted');
		}
	};
	const handleSubmitItems = async () => {
		const itemsData = {};
		itemsData.user_id = '1a012aadd';
		itemsData.items = items;

		await fetch('/api/items', {
			method: 'POST',
			body: JSON.stringify(itemsData)
		});
		toast.success('Saved!');
	};
	const handleSearch = async (value) => {
		if (value) {
			items = items.filter((item) => !item.name.search(new RegExp(value, 'i')));
		} else {
			await getItems();
		}
	};
</script>

<svelte:head>
	<title>My Items | Ezgizer</title>
</svelte:head>

<Top title={'My Items'} />

<div class="px-4 md:px-10 mx-auto w-full">
	<Toaster />

	<Table {items}>
		<div slot="left_actions" class=" flex items-center gap-1">
			<button
				class={`relative z-0 inline-flex text-sm rounded-md shadow-sm focus:ring-accent-500 focus:border-accent-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 cursor-pointer`}
				on:click={async () =>
					await getItems()
						.then(() => (refresh = true))
						.then(() => {
							getCategories();
							setTimeout(() => {
								refresh = false;
							}, 1000);
						})}
			>
				<span
					class="relative inline-flex items-center px-3 py-3 space-x-2 text-sm font-medium text-gray-600 dark:text-white bg-white dark:bg-slate-700 border border-gray-300 rounded-md sm:py-2"
				>
					<Icon class={`w-4 h-4 ${refresh ? 'spinner' : ''}`} icon="material-symbols:refresh" />
				</span>
			</button>

			<button
				class={`relative z-0 inline-flex text-sm rounded-md shadow-sm focus:ring-accent-500 focus:border-accent-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 ${
					!selected.size ? 'disabled:opacity-50' : ' cursor-pointer'
				}`}
				disabled={!selected.size}
				on:click={() => (showModal = true)}
			>
				<span
					class="relative inline-flex items-center px-3 py-3 space-x-2 text-sm font-medium text-gray-600 dark:text-white bg-white dark:bg-slate-700 border border-gray-300 rounded-md sm:py-2"
				>
					<Icon class="w-4 h-4" icon="heroicons:document-duplicate" />
					<div class="hidden sm:block">Duplicate</div>
				</span>
			</button>

			<button
				class={`relative z-0 inline-flex text-sm rounded-md shadow-sm focus:ring-accent-500 focus:border-accent-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1`}
			>
				<span
					class=" md:hidden relative inline-flex items-center px-3 py-3 space-x-2 text-sm font-medium text-gray-600 dark:text-white bg-white dark:bg-slate-700 border border-gray-300 rounded-md sm:py-2"
				>
					<Icon class="w-4 h-4" icon="ic:round-search" />
				</span>

				<div class="hidden md:block">
					<span
						class="z-10 h-full leading-snug font-normal text-center text-gray-300 dark:text-white absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3"
					>
						<Icon class=" w-4 h-4" icon="ic:round-search" />
					</span>
					<!-- type="text" -->
					<input
						on:input={(e) => handleSearch(e.target.value)}
						placeholder="Search name"
						class="border-0 px-2 py-2 placeholder-gray-300 text-gray-600 dark:text-white relative bg-white dark:bg-slate-700 rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-10"
					/>
				</div>
			</button>
		</div>

		<div slot="right_actions">
			<button
				on:click={() => handleToggleModal('Create')}
				class="relative z-0 inline-flex text-sm rounded-md shadow-sm focus:ring-accent-500 focus:border-accent-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1"
			>
				<span
					class="relative inline-flex items-center px-3 py-2 space-x-2 text-sm font-medium text-gray-600 dark:text-white bg-white dark:bg-slate-700 border border-gray-300 rounded-md sm:py-2"
				>
					<Icon class=" w-4 h-4" icon="material-symbols:add" /> Add New
				</span>
			</button>
		</div>

		<table slot="table" class="min-w-full divide-y divide-gray-200 dark:divide-gray-500 bg-white dark:bg-slate-700">
			<thead>
				<tr>
					<th scope="col" class="py-3 pl-4">
						<div class="flex items-center h-5">
							<input
								type="checkbox"
								class="text-blue-600 border-gray-200 rounded focus:ring-blue-500 cursor-pointer"
								on:change={(e) => handleToggleAll(e, items)}
								checked={selected.size === items.length}
							/>
							<label for="checkbox" class="sr-only"> Checkbox </label>
						</div>
					</th>
					<th scope="col" class="px-6 py-3 text-xs font-bold text-left text-gray-500 dark:text-white uppercase " />
					<th scope="col" class="px-6 py-3 text-xs font-bold text-left text-gray-500 dark:text-white uppercase ">
						Name
					</th>
					<th scope="col" class="px-6 py-3 text-xs font-bold text-left text-gray-500 dark:text-white uppercase ">
						Category
					</th>
					<th scope="col" class="px-6 py-3 text-xs font-bold text-left text-gray-500 dark:text-white uppercase ">
						Price
					</th>
					<th scope="col" class="px-6 py-3 text-xs font-bold text-right text-gray-500 dark:text-white uppercase ">
						Actions
					</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200 dark:divide-gray-500">
				{#each items as item, i}
					<tr>
						<td class="py-3 pl-4">
							<div class="flex items-center h-5">
								<input
									type="checkbox"
									class="text-blue-600 border-gray-200 rounded focus:ring-blue-500 cursor-pointer"
									id={item._id}
									value={item._id}
									checked={selected.size && item._id && selected.has(item._id)}
									on:change={(e) => handleToggleOne(e, item)}
								/>
								<label for="checkbox" class="sr-only"> Checkbox </label>
							</div>
						</td>
						<td class="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white whitespace-nowrap">
							{i + 1}
						</td>
						<td class="px-6 py-4 text-sm text-gray-800 dark:text-white whitespace-nowrap"> {item.name} </td>
						<td class="px-6 py-4 text-sm text-gray-800 dark:text-white whitespace-nowrap w-[20%]">
							{item.category_name || item.category}
						</td>
						<td class="px-6 py-4 text-sm text-gray-800 dark:text-white whitespace-nowrap">
							RM {item.price}
						</td>
						<td class="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
							<button on:click={() => handleToggleModal('Update', i + 1)}>
								<Icon
									class=" w-6 h-6 text-blue-500 hover:text-blue-700"
									icon="material-symbols:edit-outline-sharp"
								/>
							</button>
							<button on:click={() => handleRemoveItem(item.id || item._id)}>
								<Icon
									class=" w-6 h-6 text-red-500 hover:text-red-700"
									icon="ic:round-delete-outline"
								/></button
							>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>

		<div slot="right_submit">
			<button
				on:click={() => handleSubmitItems()}
				type="submit"
				class="inline-flex justify-center rounded-md border border-transparent bg-gray-600 text-white hover:bg-gray-800 py-2 px-4 text-sm font-medium shadow-sm"
				>Save</button
			>
		</div>
	</Table>

	<Modal
		title="Select period to duplicate your items"
		open={showModal}
		on:close={() => {
			showModal = false;
			removeCalendarSelection();
		}}
	>
		<svelte:fragment slot="body">
			<form on:submit|preventDefault={handleSubmit}>
				<div class=" pb-4">
					<h2 class=" text-sm text-gray-600 dark:text-white">
						🚨 Note: This action lead to replace all the items in your selection period.
					</h2>
				</div>
				<div class="flex items-center gap-4">
					<div class=" flex">
						<Flatpickr {options} class="hidden" />
					</div>
					<div class="flex justify-center items-center w-full">
						<h2 class=" text-6xl text-gray-500">
							{period.period_from || ''}
							<div class="flex justify-center">{period.period_to ? 'to' : ''}</div>
							{period.period_to ? period.period_to : ''}
						</h2>
					</div>
				</div>
				<div class=" pt-8 flex gap-2">
					<button
						class={`${
							!period.dateStr ? 'disabled:opacity-50' : 'hover:bg-red-600 cursor-pointer'
						} p-4 bg-red-500 text-white w-full rounded`}
						type="button"
						disabled={period.dateStr ? false : true}
						on:click={() => removeCalendarSelection()}
					>
						Reset
					</button>
					<button
						class={`${
							!period.dateStr ? 'disabled:opacity-50' : 'hover:bg-gray-800 cursor-pointer'
						} p-4 bg-gray-700 text-white w-full rounded`}
						type="submit"
						disabled={period.dateStr ? false : true}
					>
						Submit
					</button>
				</div>
			</form>
		</svelte:fragment>
	</Modal>

	<Modal
		title="Add/Update your utilities"
		open={showItemModal}
		on:close={() => (showItemModal = false)}
	>
		<svelte:fragment slot="body">
			<form on:submit|preventDefault={handleUpsertItem}>
				<div class="flex flex-wrap -mx-3 mb-6">
					<div class="w-full flex-grow md:w-1/2 px-3 mb-6 md:mb-0">
						<label
							class="block uppercase tracking-wide text-gray-700 dark:text-white text-xs font-bold mb-2"
							for="name"
						>
							Name
						</label>
						<input
							class="appearance-none block w-full bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-white dark:placeholder:text-white border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
							name="name"
							type="text"
							placeholder="Plumbing services"
							required
							value={selectedItems?.name ? selectedItems.name : ''}
						/>
						<!-- <p class="text-red-500 text-xs italic">Please fill out this field.</p> -->
					</div>
					<input
						type="text"
						name="id"
						class="hidden"
						value={selectedItems?.id ? selectedItems.id : ''}
					/>
					<input
						type="text"
						name="idx"
						class="hidden"
						value={selectedItems?.index ? selectedItems.index : ''}
					/>
					<input type="text" name="month_year" class="hidden" value={'11-22'} />

					<div class="w-full md:w-1/3 px-3">
						<label
							class="block uppercase tracking-wide text-gray-700 dark:text-white text-xs font-bold mb-2"
							for="category"
						>
							Category
						</label>
						<div class="relative">
							<select
								id="category"
								name="category"
								autocomplete="category"
								required
								class="block appearance-none w-full bg-gray-200 dark:bg-slate-700 border border-gray-200 text-gray-700 dark:text-white py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
							>
								{#each dataCategories as category}
									<option
										value={category.value}
										selected={selectedItems?.category && selectedItems?.category === category.value
											? true
											: false}>{category.name}</option
									>
								{/each}
							</select>
							<div
								class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
							>
								<svg
									class="fill-current h-4 w-4"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									><path
										d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
									/></svg
								>
							</div>
						</div>
					</div>
				</div>
				<div class="flex flex-wrap -mx-3 mb-6">
					<div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
						<label
							class="block uppercase tracking-wide text-gray-700 dark:text-white text-xs font-bold mb-2"
							for="price"
						>
							Price
						</label>
						<div class=" flex items-center gap-2 bg-gray-200 dark:bg-slate-700">
							<span class=" text-sm pl-2 ">RM</span>
							<input
								class="appearance-none block w-full bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-white border border-gray-200 rounded py-3 px-2 leading-tight focus:outline-none focus:bg-white "
								name="price"
								type="text"
								value={selectedItems?.price ? selectedItems.price : ''}
							/>
						</div>
					</div>
				</div>
				<div class="flex flex-wrap -mx-3 mb-6">
					<div class="w-full px-3">
						<label
							class="block uppercase tracking-wide text-gray-700 dark:text-white text-xs font-bold mb-2"
							for="description"
						>
							Description
						</label>
						<textarea
							id="description"
							name="description"
							rows="4"
							class="block p-2.5 w-full rounded border bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-white border-gray-200 leading-tight focus:outline-none focus:bg-white"
							value={selectedItems?.description || ''}
						/>

						<!-- <p class="text-gray-600 text-xs italic">Make it as long and as crazy as you'd like</p> -->
					</div>
				</div>

				<div class="flex flex-row-reverse">
					<!-- <div class=" px-4 py-3 text-right sm:px-6"> -->
					<button
						type="submit"
						on:click
						class="inline-flex justify-center rounded-md border border-transparent bg-gray-600 text-white hover:bg-gray-800 py-2 px-4 text-sm font-medium shadow-sm"
						>{upsertLabel}</button
					>
				</div>
			</form>
		</svelte:fragment>
	</Modal>
</div>

<style>
	:global(.spinner) {
		animation: spinner-frames 3s infinite linear;
	}
	@keyframes spinner-frames {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
