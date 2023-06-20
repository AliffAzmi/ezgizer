<script>
	import { onMount } from 'svelte';
	import { items } from '$lib/stores';
	import toast, { Toaster } from 'svelte-french-toast';
	import Icon from '@iconify/svelte';
	import { scale } from 'svelte/transition';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	import months from '$lib/data/months.js';
	import { years } from '$lib/data/years';
	import { convertCurrency } from '$lib/utils';

	import Modal from '$lib/components/Modal.svelte';
	import Table from '$lib/components/Table.svelte';
	import Top from '$lib/components/Top.svelte';

	export let data;

	const url = $page.url;
	const period = url.searchParams.get('period');
	$: current_month_name = 'January';
	$: current_month = '12';
	$: current_year = 2022;

	let showItemModal = false;
	let loading = true;
	let upsertLabel = 'Create';
	let selecteditem = {};
	let showYear = false;
	let container;
	let currentStatus = 'All';
	let queries = {};
	$: sortValue = true;
	$: total = 0;
	$: dataCategories = [];

	onMount(async () => {
		if (period) {
			current_month = period.split('-')[0];
			current_year = period.split('-')[1];
		} else {
			current_month_name =
				months.find(
					(m) =>
						m.value ===
						new Date().toLocaleString('en-US', { month: '2-digit', timeZone: 'Asia/Singapore' })
				).name || 'January';
			current_month = `${
				new Date().toLocaleString('en-US', { month: '2-digit', timeZone: 'Asia/Singapore' }) || '12'
			}`;
			current_year = new Date().getFullYear() || 2022;
		}

		await getUtilities(period);
		await handleGetMonthTranslation();
		await getCategories();
	});

	const getCategories = async () => {
		const response = await fetch(`/api/categories`, {
			method: 'GET'
		});
		const { category } = await response.json();
		dataCategories = category;
	};

	const handleGetMonthTranslation = () => {
		current_month_name = months.find((m) => m.value === current_month).name || '';
	};

	const getUtilities = async (period) => {
		const month_year = period ? period : `${current_month}-${current_year}`;

		url.searchParams.set('period', month_year);
		goto(`?${url.searchParams.toString()}`);

		const response = await fetch(
			`/api/utilities?month_year=${month_year}&queries=${JSON.stringify(queries)}`,
			{
				method: 'GET'
			}
		);

		const payload = await response.json();
		if (payload?.items) {
			$items = payload.items;
			total = payload.total;
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
		itemsData.user_id = data?.user?.id;
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
	const handleToggleOne = async (e, item) => {
		if (item._id) {
			$items.find((itm) => itm._id === item._id).status = e.target.checked ? 1 : 0;
		} else {
			$items.find((itm) => itm.id === item.id).status = e.target.checked ? 1 : 0;
		}
	};
	const handleChangeQuery = async ({ status, q, sort }) => {
		if (status || status === 0) {
			if (status === 'all') {
				delete queries.status;
			} else {
				queries.status = status;
			}
			currentStatus =
				status === 1 ? 'Completed' : status === 0 ? 'Pending' : status === 'all' ? 'All' : 'All';
			await getUtilities();
		}
		if (q) {
			$items = $items.filter((item) => !item.name.search(new RegExp(q, 'i')));
		} else {
			await getUtilities();
		}

		$items = $items.sort((a, b) =>
			sort ? parseInt(b.price) - parseInt(a.price) : parseInt(a.price) - parseInt(b.price)
		);
	};

	const getCategoryName = async (val) => {
		const res = await fetch(`/api/categories?value=${val}`, { method: 'GET' });
		return res.json();
	};

	const showDropdownOptions = () => {
		document.getElementById('options').classList.toggle('hidden');
		document.getElementById('arrow-up').classList.toggle('hidden');
		document.getElementById('arrow-down').classList.toggle('hidden');
	};

	const scrollOnActive = (node, active) => {
		const update = (active) => {
			if (active) node.scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' });
		};
		update(active);

		return { update };
	};
</script>

<svelte:head>
	<title>My Utilities | Ezgizer</title>
</svelte:head>

<Top title={'My Utilities'} />

<svelte:window
	on:click={(e) => {
		if (container.contains(e.target) === false) showYear = false;
	}}
/>

<div class="px-4 md:px-10 mx-auto w-full">
	<Toaster />
	<div class=" flex">
		<h1 class=" text-2xl">
			{current_month_name} -
		</h1>
		<div class="ml-2 relative">
			<button
				type="button"
				class="inline-flex justify-center rounded-md border border-gray-300 bg-white dark:bg-slate-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-white shadow-sm hover:bg-gray-50 "
				on:click={() => (showYear = !showYear)}
				bind:this={container}
			>
				{current_year}

				<Icon class=" -mr-1 ml-2 h-5 w-5 " icon="mdi:chevron-down" />
			</button>
			{#if showYear}
				<div
					in:scale={{ duration: 100, start: 0.95 }}
					out:scale={{ duration: 75, start: 0.95 }}
					class="absolute z-20 mt-2 w-24 rounded-md overflow-auto h-32 bg-white dark:bg-slate-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
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
							<span class={`text-gray-700 dark:text-white block px-4 py-2 text-sm`}>{year}</span>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<Table {loading} items={$items}>
		<div slot="left_actions" class=" flex items-center gap-1">
			<!-- <form class="md:flex hidden flex-row flex-wrap items-center lg:ml-auto mr-3"> -->

			<div class="flex flex-row justify-center">
				<div class="flex-none text-sm">
					<button
						on:click={() => showDropdownOptions()}
						class="flex flex-row justify-between w-32 px-2 py-2 text-gray-700 dark:text-white bg-white dark:bg-slate-700 rounded-md border border-gray-300"
					>
						<span class="select-none">Status: {currentStatus}</span>

						<Icon id="arrow-down" class="hidden w-5 h-5 stroke-current" icon="mdi:chevron-down" />
						<Icon id="arrow-up" class="w-5 h-5 stroke-current" icon="mdi:chevron-up" />
					</button>
					<div
						id="options"
						class="hidden absolute w-32 py-2 mt-2 bg-white dark:bg-slate-700 rounded-lg shadow-xl"
					>
						<button
							on:click={() => handleChangeQuery({ status: 'all' })}
							class="block px-4 py-2 text-gray-800 dark:text-white">All</button
						>
						<button
							on:click={() => handleChangeQuery({ status: 1 })}
							class="block px-4 py-2 text-gray-800 dark:text-white">Completed</button
						>
						<button
							on:click={() => handleChangeQuery({ status: 0 })}
							class="block px-4 py-2 text-gray-800 dark:text-white">Pending</button
						>
					</div>
				</div>
			</div>

			<div class="relative flex w-full flex-wrap items-stretch">
				<span
					class=" md:hidden relative inline-flex items-center px-3 py-3 space-x-2 text-sm font-medium text-gray-600 bg-white dark:bg-slate-700 border border-gray-300 rounded-md sm:py-2"
				>
					<Icon class="w-3 h-3" icon="ic:round-search" />
				</span>

				<div class="hidden md:block">
					<span
						class="z-10 h-full leading-snug font-normal text-center text-gray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3"
					>
						<Icon class=" w-4 h-4" icon="ic:round-search" />
					</span>
					<!-- type="text" -->
					<input
						on:input={(e) => handleChangeQuery({ q: e.target.value })}
						placeholder="Search name"
						class="border-0 px-2 py-2 placeholder-gray-300 text-gray-600 dark:text-white relative bg-white dark:bg-slate-700 rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-10"
					/>
				</div>
			</div>
			<!-- </form> -->
		</div>

		<div slot="left_actions_2">
			<div class=" flex items-center gap-2">
				{#each months as month}
					<button
						on:click={() => handleSelectMonth(month.value)}
						class={`relative z-0 inline-flex text-sm rounded-md shadow-sm focus:ring-accent-500 focus:border-accent-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1`}
					>
						<span
							use:scrollOnActive={current_month === month.value}
							class={`${
								current_month === month.value ? 'bg-gray-300 dark:bg-white ' : 'dark:text-white'
							} relative inline-flex items-center px-3 py-3 space-x-2 text-sm font-medium text-gray-600 bg-white dark:bg-slate-700 border border-gray-300 dark:border-none rounded-md sm:py-2`}
						>
							<span value={month.value}>{month.name_abbr}</span>
						</span>
					</button>
				{/each}
			</div>
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

		<table
			slot="table"
			class="min-w-full divide-y divide-gray-200 dark:divide-gray-500 bg-white dark:bg-slate-700"
		>
			<thead>
				<tr>
					<th scope="col" class="py-3 pl-4 hidden lg:block">
						<!-- <div class="flex items-center h-5">
							<input
								id="checkbox-all"
								type="checkbox"
								class="text-blue-600 border-gray-200 rounded focus:ring-blue-500"
							/>
							<label for="checkbox" class="sr-only"> Checkbox </label>
						</div> -->
					</th>
					<th
						scope="col"
						class="px-6 py-3 text-xs font-bold text-left text-gray-500 dark:text-white uppercase "
					>
						Name
					</th>
					<th
						scope="col"
						class="px-6 py-3 text-xs font-bold text-left text-gray-500 dark:text-white uppercase hidden lg:block"
					>
						Category
					</th>
					<th scope="col" class="px-6 py-3 ">
						<button
							class=" flex items-center gap-2 cursor-pointer"
							on:click={() => {
								sortValue = !sortValue;
								handleChangeQuery({ sort: sortValue });
							}}
						>
							<span class="text-xs font-bold text-left text-gray-500 dark:text-white uppercase"
								>Amount</span
							>
							<Icon icon="bxs:sort-alt" />
						</button>
					</th>
					<th
						scope="col"
						class="px-6 py-3 text-xs font-bold text-right text-gray-500 dark:text-white uppercase "
					>
						Status
					</th>
					<th
						scope="col"
						class="px-6 py-3 text-xs font-bold text-right text-gray-500 dark:text-white uppercase "
					/>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200 dark:divide-gray-500">
				{#each $items as item, i}
					<tr>
						<td
							class="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white whitespace-nowrap hidden lg:block"
						>
							{i + 1}
						</td>
						<td class="px-6 py-4 text-sm text-gray-800 dark:text-white whitespace-nowrap">
							{item.name}
						</td>
						<td
							class="px-6 py-4 text-sm text-gray-800 dark:text-white whitespace-nowrap w-[20%] hidden lg:block"
						>
							{#await getCategoryName(item.category)}
								<Icon class=" w-4 h-4" icon="eos-icons:loading" />
							{:then { category }}
								{category.name}
							{/await}
						</td>
						<td class="px-6 py-4 text-sm text-gray-800 dark:text-white whitespace-nowrap">
							{convertCurrency(data?.setting?.currency, item.price, true)}
						</td>
						<td class="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
							<input
								type="checkbox"
								checked={item?.status ? true : false}
								on:change={(e) => handleToggleOne(e, item)}
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
				<tr class=" border-0">
					<td class="hidden lg:block" />
					<td />
					<td class="hidden lg:block" />
					<td class=" px-6 py-4 text-sm text-gray-800 dark:text-white whitespace-nowrap font-bold">
						{convertCurrency(data?.setting?.currency, total, true)}
					</td>
					<td />
					<td />
				</tr>
			</tbody>
		</table>

		<div slot="right_submit">
			<button
				on:click={() => handleSubmit()}
				type="submit"
				class="inline-flex justify-center rounded-md border border-transparent bg-gray-600 text-white hover:bg-gray-800 py-2 px-4 text-sm font-medium shadow-sm"
				>Save</button
			>
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
							class="block uppercase tracking-wide text-gray-700 dark:text-white text-xs font-bold mb-2"
							for="name"
						>
							Name
						</label>
						<input
							class="appearance-none block w-full bg-gray-200 text-gray-700 dark:text-white border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white dark:bg-slate-700"
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
							class="block uppercase tracking-wide text-gray-700 dark:text-white text-xs font-bold mb-2"
							for="category"
						>
							Category
						</label>
						<div class=" flex items-center gap-1">
							<div class="relative flex-grow">
								<select id="category" name="category" autocomplete="category" required>
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
									class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-white"
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
							<a href="/categories">
								<Icon
									icon="gridicons:add-outline"
									width="24"
									height="24"
									class=" cursor-pointer hover:text-blue-600"
								/>
							</a>
						</div>
					</div>
				</div>
				<div class="flex flex-wrap -mx-3 mb-6">
					<div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
						<label
							class="block uppercase tracking-wide text-gray-700 dark:text-white text-xs font-bold mb-2"
							for="price"
						>
							Amount
						</label>
						<div class=" flex items-center gap-2 bg-gray-200 dark:bg-slate-600">
							<span class=" text-sm pl-2 ">{convertCurrency(data?.setting?.currency, 0)}</span>
							<input
								class="appearance-none block w-full bg-gray-200 text-gray-700 dark:text-white border border-gray-200 rounded py-3 px-2 leading-tight focus:outline-none focus:bg-white dark:bg-slate-700 "
								name="price"
								type="text"
								value={selecteditem?.price ? selecteditem.price : ''}
							/>
						</div>
					</div>
					<div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
						<label
							class="block uppercase tracking-wide text-gray-700 dark:text-white text-xs font-bold mb-2"
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
							class="block uppercase tracking-wide text-gray-700 dark:text-white text-xs font-bold mb-2"
							for="recurring"
						>
							Recurring
						</label>
						<!-- class="appearance-none block w-full bg-gray-200 text-gray-700 dark:text-white border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white dark:bg-slate-700 focus:border-gray-500" -->
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
							class="block uppercase tracking-wide text-gray-700 dark:text-white text-xs font-bold mb-2"
							for="description"
						>
							Description
						</label>
						<textarea
							id="description"
							name="description"
							rows="4"
							class="block p-2.5 w-full rounded border bg-gray-200 text-gray-700 dark:text-white border-gray-200 leading-tight focus:outline-none focus:bg-white dark:bg-slate-700"
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
