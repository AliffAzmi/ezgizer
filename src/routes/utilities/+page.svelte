<script>
	import { onMount } from 'svelte';
	import { items } from '$lib/stores';
	import toast, { Toaster } from 'svelte-french-toast';
	import Icon from '@iconify/svelte';
	import { scale } from 'svelte/transition';
	import months from '$lib/data/months.js';
	import { years } from '$lib/data/years';
	// import dataitems from '$lib/data/items.js';
	import dataCategories from '$lib/data/categories.js';
	import Modal from '$lib/components/Modal.svelte';
	import Table from '$lib/components/Table.svelte';
	import Top from '$lib/components/Top.svelte';

	$: current_month_name = '';
	$: current_month = 12;
	$: current_year = 2022;
	let showItemModal = false;
	let loading = true;
	let upsertLabel = 'Create';
	let selecteditem = {};
	let showYear = false;

	onMount(async () => {
		await getUtilities();
		await handleGetMonthTranslation();
	});

	const handleGetMonthTranslation = () => {
		current_month_name = months.find((m) => m.value === current_month).name || '';
	};

	const getUtilities = async () => {
		const user_id = '1a012aadd';
		const month_year = `${current_month}-${current_year}`;
		const response = await fetch(`/api/utilities?user_id=${user_id}&month_year=${month_year}`, {
			method: 'GET'
		});

		const payload = await response.json();
		if (payload?.items) {
			$items = payload.items;
		} else {
			$items = [];
		}
		loading = false;
	};

	const handleToggleModal = (label, index) => {
		upsertLabel = label ? label : 'Create';
		if (label === 'Update') {
			selecteditem = $items.find((item, idx) => idx + 1 === index);
			selecteditem.index = index;
		} else {
			selecteditem = {};
		}
		showItemModal = !showItemModal;
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
		$items[data?.idx ? data.idx - 1 : $items.length] = data;
		showItemModal = false;
		toast('Please click save button to save your changes!', {
			icon: '🚨'
		});
	};
	const handleRemoveItem = (idx) => {
		if (confirm('Are you sure to remove this item?')) {
			$items = $items.filter((item, index) => index !== idx - 1);
		}
	};

	const handleSubmit = async () => {
		const itemsData = {};
		itemsData.user_id = '1a012aadd';
		itemsData.month_year = `${current_month}-${current_year}`;
		itemsData.items = $items;

		try {
			fetch('/api/items', {
				method: 'POST',
				body: JSON.stringify(itemsData)
			});
			await fetch('/api/utilities', {
				method: 'POST',
				body: JSON.stringify(itemsData)
			});
			toast.success('Saved!');
		} catch (error) {
			toast.error('Something went wrong. Please try again.');
		}
	};

	const handleSelectMonth = async (month) => {
		current_month = month;
		await getUtilities();
		handleGetMonthTranslation();
	};
	const handleSelectYear = async (year) => {
		current_year = year;
		await getUtilities();
		handleGetMonthTranslation();
	};
</script>

<svelte:head>
	<title>My Utilities | Ezgizer</title>
</svelte:head>

<Top title={'My Utilities'} />

<div class="px-4 md:px-10 mx-auto w-full">
	<Toaster />
	<h1 class=" text-2xl">{current_month_name} - {current_year}</h1>

	<Table {loading} items={$items}>
		<div slot="left_actions_2">
			<div class=" flex items-center gap-2">
				{#each months as month}
					<button
						on:click={() => handleSelectMonth(month.value)}
						class={`relative z-0 inline-flex text-sm rounded-md shadow-sm focus:ring-accent-500 focus:border-accent-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1`}
					>
						<span
							class={` ${
								current_month === month.value && 'bg-gray-300'
							}  relative inline-flex items-center px-3 py-3 space-x-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md sm:py-2`}
						>
							<span value={month.value}>{month.name_abbr}</span>
						</span>
					</button>
				{/each}
			</div>
		</div>
		<div slot="right_actions_2" class="relative inline-block text-left">
			<div>
				<button
					type="button"
					class="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 "
					on:click={() => (showYear = !showYear)}
				>
					{current_year}

					<Icon class=" -mr-1 ml-2 h-5 w-5 " icon="mdi:chevron-down" />
				</button>
			</div>
			{#if showYear}
				<div
					in:scale={{ duration: 100, start: 0.95 }}
					out:scale={{ duration: 75, start: 0.95 }}
					class="absolute right-0 z-10 mt-2 w-24 rounded-md overflow-auto h-32 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
				>
					{#each years as year}
						<div
							class={`py-1 cursor-pointer ${current_year === year ? ' bg-gray-300' : ''}`}
							on:click={() => {
								handleSelectYear(year);
								showYear = !showYear;
							}}
							role="none"
						>
							<span class={`text-gray-700 block px-4 py-2 text-sm`}>{year}</span>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<div slot="right_actions">
			<button
				on:click={() => handleToggleModal('Create')}
				class="relative z-0 inline-flex text-sm rounded-md shadow-sm focus:ring-accent-500 focus:border-accent-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1"
			>
				<span
					class="relative inline-flex items-center px-3 py-3 space-x-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md sm:py-2"
				>
					<Icon class=" w-4 h-4" icon="material-symbols:add" /> Add New
				</span>
			</button>
		</div>

		<table slot="table" class="min-w-full divide-y divide-gray-200">
			<thead class="bg-gray-50">
				<tr>
					<th scope="col" class="py-3 pl-4">
						<!-- <div class="flex items-center h-5">
							<input
								id="checkbox-all"
								type="checkbox"
								class="text-blue-600 border-gray-200 rounded focus:ring-blue-500"
							/>
							<label for="checkbox" class="sr-only"> Checkbox </label>
						</div> -->
					</th>
					<th scope="col" class="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
						Name
					</th>
					<th scope="col" class="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
						Category
					</th>
					<th scope="col" class="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase ">
						Price
					</th>
					<th scope="col" class="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase ">
						Status
					</th>
					<th scope="col" class="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase " />
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200">
				{#each $items as item, i}
					<tr>
						<td class="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
							{i + 1}
						</td>
						<td class="px-6 py-4 text-sm text-gray-800 whitespace-nowrap"> {item.name} </td>
						<td class="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
							{item.category}
						</td>
						<td class="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
							RM {item.price}
						</td>
						<td class="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
							<input
								type="checkbox"
								checked={item?.status ? true : false}
								on:change={(e) => ($items.find((itm) => itm.id === item.id).status = !item.status)}
								value={1}
							/>
						</td>
						<td class="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
							<button on:click={() => handleToggleModal('Update', i + 1)}>
								<Icon
									class=" w-6 h-6 text-blue-500 hover:text-blue-700"
									icon="material-symbols:edit-outline-sharp"
								/>
							</button>
							<button on:click={() => handleRemoveItem(i + 1)}>
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
				class="relative z-0 inline-flex text-sm rounded-md shadow-sm focus:ring-accent-500 focus:border-accent-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1"
			>
				<span
					class="relative inline-flex items-center px-3 py-3 space-x-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md sm:py-2"
				>
					<button class=" button" on:click={() => handleSubmit()}>Save</button>
				</span>
			</button>
		</div>
	</Table>

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
							class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
							for="name"
						>
							Name
						</label>
						<input
							class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
							name="name"
							type="text"
							placeholder="Plumbing services"
							required
							value={selecteditem?.name ? selecteditem.name : ''}
						/>
						<!-- <p class="text-red-500 text-xs italic">Please fill out this field.</p> -->
					</div>
					<input
						type="text"
						name="id"
						class="hidden"
						value={selecteditem?.id ? selecteditem.id : ''}
					/>
					<input
						type="text"
						name="idx"
						class="hidden"
						value={selecteditem?.index ? selecteditem.index : ''}
					/>
					<input type="text" name="month_year" class="hidden" value={'11-22'} />

					<div class="w-full md:w-1/3 px-3">
						<label
							class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
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
								class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
							>
								{#each dataCategories as category}
									<option
										value={category.value}
										selected={selecteditem?.category && selecteditem?.category === category.value
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
							class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
							for="price"
						>
							Price
						</label>
						<div class=" flex items-center gap-2 bg-gray-200">
							<span class=" text-sm pl-2 ">RM</span>
							<input
								class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-2 leading-tight focus:outline-none focus:bg-white "
								name="price"
								type="text"
								value={selecteditem?.price ? selecteditem.price : ''}
							/>
						</div>
					</div>
					<div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
						<label
							class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
							for="status"
						>
							Status
						</label>
						<input
							type="checkbox"
							name="status"
							id="status"
							checked={selecteditem?.status ? true : false}
							value={1}
						/>
					</div>
					<div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
						<label
							class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
							for="recurring"
						>
							Recurring
						</label>
						<!-- class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" -->
						<input
							type="checkbox"
							id="recurring"
							name="recurring"
							checked={selecteditem?.recurring ? true : false}
							value={1}
						/>
					</div>
				</div>
				<div class="flex flex-wrap -mx-3 mb-6">
					<div class="w-full px-3">
						<label
							class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
							for="description"
						>
							Description
						</label>
						<textarea
							id="description"
							name="description"
							rows="4"
							class="block p-2.5 w-full rounded border bg-gray-200 text-gray-700 border-gray-200 leading-tight focus:outline-none focus:bg-white"
							value={selecteditem?.description || ''}
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
