<script>
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import Table from '$lib/components/Table.svelte';
	// import flatpickr from 'flatpickr';
	import Flatpickr from 'svelte-flatpickr';
	import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect';
	import Modal from '$lib/components/Modal.svelte';

	import 'flatpickr/dist/flatpickr.css';
	import 'flatpickr/dist/plugins/monthSelect/style.css';
	import Top from '../../lib/components/Top.svelte';

	$: items = [];
	$: selectedItems = [];
	let selected = new Set();
	let showModal = false;
	let period = {};
	let instances = {};
	let options = {
		inline: true,
		mode: 'range',
		plugins: [
			new monthSelectPlugin({
				shorthand: true,
				dateFormat: 'm-y',
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

				if (range > 60) {
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

	const handleSubmit = () => {
		console.log(period.dateStr);
		console.log(selectedItems);
	};
</script>

<svelte:head>
	<title>My Items | Ezgizer</title>
</svelte:head>

<Top title={'My Items'} />

<div class="px-4 md:px-10 mx-auto w-full">
	{#if items.length}
		<Table {items}>
			<div slot="left_actions">
				<button
					class={`relative z-0 inline-flex text-sm rounded-md shadow-sm focus:ring-accent-500 focus:border-accent-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 ${
						!selected.size ? 'disabled:opacity-50' : ' cursor-pointer'
					}`}
					disabled={!selected.size}
					on:click={() => (showModal = true)}
				>
					<span
						class="relative inline-flex items-center px-3 py-3 space-x-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md sm:py-2"
					>
						<Icon class="w-4 h-4" icon="heroicons:document-duplicate" />
						<div class="hidden sm:block">Duplicate</div>
					</span>
				</button>
			</div>

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
						<th
							scope="col"
							class="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
						/>
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
							Actions
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200">
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
								<a class="text-blue-500 hover:text-blue-700" href="#/"> Edit </a> |
								<a class="text-blue-500 hover:text-blue-700" href="#/"> View </a>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</Table>
	{/if}

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
						} p-4 bg-red-500 text-white w-full`}
						type="button"
						disabled={period.dateStr ? false : true}
						on:click={() => removeCalendarSelection()}
					>
						Reset
					</button>
					<button
						class={`${
							!period.dateStr ? 'disabled:opacity-50' : 'hover:bg-blue-600 cursor-pointer'
						} p-4 bg-blue-500 text-white w-full`}
						type="submit"
						disabled={period.dateStr ? false : true}
					>
						Submit
					</button>
				</div>
			</form>
		</svelte:fragment>
	</Modal>
</div>
