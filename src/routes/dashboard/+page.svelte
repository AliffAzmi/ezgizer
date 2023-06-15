<script>
	import { onMount } from 'svelte';
	// import { page } from '$app/stores';
	import Flatpickr from 'svelte-flatpickr';
	import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect';

	import Top from '$lib/components/Top.svelte';
	import Icon from '@iconify/svelte';

	import 'flatpickr/dist/flatpickr.css';
	import 'flatpickr/dist/plugins/monthSelect/style.css';
	import PieChart from '../../lib/components/PieChart.svelte';

	let totalFigure = 0;
	let pendingFigure = 0;
	let spentFigure = 0;
	let mostUtilitesList = [];
	let mostCategoriesList = [];
	let current_month = `${
		new Date().toLocaleString('en-US', { month: '2-digit', timeZone: 'Asia/Singapore' }) || '12'
	}`;
	let current_year = new Date().getFullYear() || 2022;
	$: periodKey = `${current_month}-${current_year}`;

	const options = {
		disableMobile: true,
		animate: true,
		altFormat: 'F Y',
		altInput: true,
		plugins: [
			new monthSelectPlugin({
				shorthand: true,
				dateFormat: 'm-Y',
				altFormat: 'F Y'
			})
		],
		onChange(selectedDates, dateStr) {
			periodKey = dateStr;
			init();
		}
	};

	$: performanceFigure = 0;
	$: topAnalytics = [
		{
			name: 'total',
			figure: totalFigure,
			bgColor: 'bg-red-500',
			icon: 'material-symbols:attach-money'
		},
		{
			name: 'pending',
			figure: pendingFigure,
			bgColor: 'bg-orange-500',
			icon: 'material-symbols:pending-actions-rounded'
		},
		{
			name: 'spent',
			figure: spentFigure,
			bgColor: 'bg-pink-500',
			icon: 'ic:twotone-download-done'
		},
		{
			name: 'performance',
			figure: performanceFigure,
			bgColor: 'bg-emerald-500',
			icon: 'mdi:performance'
		}
	];

	const init = async () => {
		const { id } = await getUsers();
		const { total, pending, spent, performance, most_utilities, most_categories } =
			await getOverallReports(id);

		totalFigure = new Intl.NumberFormat('ta-MY', { style: 'currency', currency: 'MYR' }).format(
			total || 0
		);
		pendingFigure = new Intl.NumberFormat('ta-MY', { style: 'currency', currency: 'MYR' }).format(
			pending || 0
		);
		spentFigure = new Intl.NumberFormat('ta-MY', { style: 'currency', currency: 'MYR' }).format(
			spent || 0
		);
		performanceFigure = Math.round(performance || 0) + '%';

		mostUtilitesList = most_utilities || [];
		mostCategoriesList = most_categories || [];
	};
	onMount(async () => {
		await init();
	});

	const getCategoryName = async (val) => {
		const res = await fetch(`/api/categories?value=${val}`, { method: 'GET' });
		return res.json();
	};

	const getOverallReports = async (id) => {
		const response = await fetch(`/api/reports/overall?user_id=1a012aadd&period=${periodKey}`, {
			method: 'GET'
		});
		return await response.json();
	};

	const getUsers = async () => {
		const response = await fetch('/api/users/1a012aadd', {
			method: 'GET'
		});
		const { user } = await response.json();
		return user;
	};
</script>

<svelte:head>
	<title>Dashboard | Ezgizer</title>
</svelte:head>

<Top title={'Dashboard'} />

<div class="relative pb-12 pt-12">
	<div class="md:px-10 mx-auto w-full">
		<div class=" mb-6 px-4 flex flex-row-reverse items-center gap-4">
			<Flatpickr {options} value={new Date()} class=" p-4" element="#my-picker">
				<div class="flatpickr" id="my-picker">
					<div class="relative mt-2 rounded-md shadow-sm">
						<input
							type="text"
							class="block w-full rounded-md border-0 py-1.5 pl-2 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
							data-input
						/>
						<div class="absolute inset-y-0 right-0 mr-2 flex items-center">
							<Icon class="text-gray-500 sm:text-sm" icon="fluent-mdl2:calendar-year" />
						</div>
					</div>
				</div>
			</Flatpickr>
		</div>

		<div class="flex flex-wrap">
			{#each topAnalytics as topAnalytic}
				<div class="w-full lg:w-6/12 xl:w-3/12 px-4">
					<div
						class="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg"
					>
						<div class="flex-auto p-4">
							<div class="flex flex-wrap">
								<div class="relative w-full max-w-full flex-grow flex-1">
									<h5 class="text-gray-400 uppercase font-bold text-xs">{topAnalytic.name}</h5>
									<span class="font-semibold text-xl text-gray-700">{topAnalytic.figure}</span>
								</div>
								<div class="relative w-auto flex-initial">
									<div
										class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full {topAnalytic.bgColor}"
									>
										<Icon class=" w-6 h-6" icon={topAnalytic.icon} />
									</div>
								</div>
							</div>
							<!-- <p class="text-sm text-gray-400 mt-4">
									<span class="mr-2 text-emerald-500"><i class="fas fa-arrow-up" /> 3.48%</span>
									<span class="whitespace-nowrap">Higher prev month</span>
								</p> -->
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
<div class="px-4 md:px-10 mx-auto w-full -mt-4">
	<div class="flex flex-wrap mt-4">
		<div class="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
			<div
				class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded"
			>
				<div class="rounded-t mb-0 px-4 py-3 border-0">
					<div class="flex flex-wrap items-center">
						<div class="relative w-full px-2 max-w-full flex-grow flex-1">
							<h3 class="font-semibold text-base text-gray-700">Utilities</h3>
						</div>
						<div class="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
							<button
								class="bg-red-500 text-white active:bg-red-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
								type="button"
							>
								<a href="/utilities?period={periodKey}">See all</a>
							</button>
						</div>
					</div>
				</div>
				<div class="block w-full overflow-x-auto">
					<table class="items-center w-full bg-transparent border-collapse">
						<thead>
							<tr>
								<th
									class="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
								>
									Name
								</th>
								<th
									class="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
									>Category</th
								>
								<th
									class="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
									>Price</th
								>
								<th
									class="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
								/>
							</tr>
						</thead>
						<tbody>
							{#each mostUtilitesList as utility}
								<tr class="border-white {utility?.status ? 'bg-green-100 border-t-2' : ''}">
									<th
										class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left"
									>
										{utility.name}
									</th>
									<td
										class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
									>
										{#await getCategoryName(utility.category)}
											<Icon class=" w-4 h-4" icon="eos-icons:loading" />
										{:then { category }}
											{category.name}
										{/await}
									</td>
									<td
										class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
									>
										{utility.price}
									</td>

									<td
										class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
									>
										{#if utility?.status}
											<Icon class=" w-4 h-4" icon="fluent-emoji-flat:check-mark-button" />
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>

		<div class="w-full xl:w-4/12 px-4">
			<div
				class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded"
			>
				<div class="rounded-t mb-0 px-4 py-3 border-0">
					<div class="flex flex-wrap items-center">
						<div class="relative w-full px-2 max-w-full flex-grow flex-1">
							<h3 class="font-semibold text-base text-gray-700">Categories</h3>
						</div>
						<div class="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
							<button
								class="bg-red-500 text-white active:bg-red-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
								type="button"><a href="/categories">See all</a></button
							>
						</div>
					</div>
				</div>

				<div class="block w-full overflow-x-auto">
					<div class=" flex justify-center items-center w-full px-6">
						<PieChart data={mostCategoriesList} />
					</div>
					<table class="items-center w-full bg-transparent border-collapse">
						<thead class="thead-light">
							<tr>
								<th
									class="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
									>Name</th
								>
								<th
									class="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
									>Price</th
								>
								<th
									class="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-140-px"
									>Txns</th
								>
							</tr>
						</thead>
						<tbody>
							{#each mostCategoriesList as category}
								<tr>
									<th
										class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left"
									>
										{#await getCategoryName(category.name)}
											<Icon class=" w-4 h-4" icon="eos-icons:loading" />
										{:then { category }}
											{category.name}
										{/await}
									</th>
									<td
										class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
										>{category.price}</td
									>
									<td
										class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
										><div class="flex items-center">
											<span class="mr-2">{category.txns}</span>
											<!-- <div class="relative w-full">
										<div class="overflow-hidden h-2 text-xs flex rounded bg-red-200">
											<div
												style="width: 60%;"
												class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
											/>
										</div>
									</div> -->
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>
