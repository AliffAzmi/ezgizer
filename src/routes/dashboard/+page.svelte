<script>
	import { onMount } from 'svelte';
	// import { page } from '$app/stores';
	import Top from '$lib/components/Top.svelte';
	import Icon from '@iconify/svelte';

	let totalFigure = 0;
	let pendingFigure = 0;
	let spentFigure = 0;
	let mostUtilitesList = [];
	let mostCategoriesList = [];
	$: performanceFigure = 0;
	onMount(async () => {
		const { id } = await getUsers();
		const { total, pending, spent, performance, most_utilities, most_categories } =
			await getOverallReports(id);

		totalFigure = new Intl.NumberFormat('ta-MY', { style: 'currency', currency: 'MYR' }).format(
			total
		);
		pendingFigure = new Intl.NumberFormat('ta-MY', { style: 'currency', currency: 'MYR' }).format(
			pending
		);
		spentFigure = new Intl.NumberFormat('ta-MY', { style: 'currency', currency: 'MYR' }).format(
			spent
		);
		performanceFigure = Math.round(performance);
		mostUtilitesList = most_utilities;
		mostCategoriesList = most_categories;
	});

	const getCategoryName = async (val) => {
		const res = await fetch(`/api/categories?value=${val}`, { method: 'GET' });
		return res.json();
	};

	const getOverallReports = async (id) => {
		const response = await fetch('/api/reports/overall?user_id=1a012aadd&period=12-2022', {
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
	<div class="px-4 md:px-10 mx-auto w-full">
		<div>
			<div class="flex flex-wrap">
				<div class="w-full lg:w-6/12 xl:w-3/12 px-4">
					<div
						class="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg"
					>
						<div class="flex-auto p-4">
							<div class="flex flex-wrap">
								<div class="relative w-full pr-4 max-w-full flex-grow flex-1">
									<h5 class="text-gray-400 uppercase font-bold text-xs">TOTAL</h5>
									<span class="font-semibold text-xl text-gray-700">{totalFigure}</span>
								</div>
								<div class="relative w-auto pl-4 flex-initial">
									<div
										class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-red-500"
									>
										<Icon class=" w-6 h-6" icon="material-symbols:attach-money" />
									</div>
								</div>
							</div>
							<p class="text-sm text-gray-400 mt-4">
								<span class="mr-2 text-emerald-500"><i class="fas fa-arrow-up" /> 3.48%</span>
								<span class="whitespace-nowrap">Higher prev month</span>
							</p>
						</div>
					</div>
				</div>
				<div class="w-full lg:w-6/12 xl:w-3/12 px-4">
					<div
						class="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg"
					>
						<div class="flex-auto p-4">
							<div class="flex flex-wrap">
								<div class="relative w-full pr-4 max-w-full flex-grow flex-1">
									<h5 class="text-gray-400 uppercase font-bold text-xs">PENDING</h5>
									<span class="font-semibold text-xl text-gray-700">{pendingFigure}</span>
								</div>
								<div class="relative w-auto pl-4 flex-initial">
									<div
										class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-orange-500"
									>
										<Icon class=" w-6 h-6" icon="material-symbols:pending-actions-rounded" />
									</div>
								</div>
							</div>
							<p class="text-sm text-gray-400 mt-4">
								<span class="mr-2 text-red-500"> 3.48%</span>
								<span class="whitespace-nowrap">Since last week</span>
							</p>
						</div>
					</div>
				</div>
				<div class="w-full lg:w-6/12 xl:w-3/12 px-4">
					<div
						class="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg"
					>
						<div class="flex-auto p-4">
							<div class="flex flex-wrap">
								<div class="relative w-full pr-4 max-w-full flex-grow flex-1">
									<h5 class="text-gray-400 uppercase font-bold text-xs">SPENT</h5>
									<span class="font-semibold text-xl text-gray-700">{spentFigure}</span>
								</div>
								<div class="relative w-auto pl-4 flex-initial">
									<div
										class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-pink-500"
									>
										<Icon class=" w-6 h-6" icon="ic:twotone-download-done" />
									</div>
								</div>
							</div>
							<p class="text-sm text-gray-400 mt-4">
								<span class="mr-2 text-orange-500"><i class="fas fa-arrow-down" /> 1.10%</span>
								<span class="whitespace-nowrap">Since yesterday</span>
							</p>
						</div>
					</div>
				</div>
				<div class="w-full lg:w-6/12 xl:w-3/12 px-4">
					<div
						class="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg"
					>
						<div class="flex-auto p-4">
							<div class="flex flex-wrap">
								<div class="relative w-full pr-4 max-w-full flex-grow flex-1">
									<h5 class="text-gray-400 uppercase font-bold text-xs">PERFORMANCE</h5>
									<span class="font-semibold text-xl text-gray-700">{performanceFigure}%</span>
								</div>
								<div class="relative w-auto pl-4 flex-initial">
									<div
										class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-emerald-500"
									>
										<Icon class=" w-6 h-6" icon="mdi:performance" />
									</div>
								</div>
							</div>

							<div class="bg-gray-200 relative h-4 w-full rounded-2xl text-sm mt-4">
								<div
									class={`bg-green-400 absolute top-0 left-0 flex h-full ${
										performanceFigure ? `w-[${performanceFigure}%]` : 'w-[0%]'
									} items-center justify-center rounded-2xl text-xs font-semibold text-white`}
									style={`width: ${performanceFigure}%;`}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
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
								class="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
								type="button">See all</button
							>
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
							</tr>
						</thead>
						<tbody>
							{#each mostUtilitesList as utility}
								<tr>
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
									<!--
									<td
										class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
										><i class="fas fa-arrow-up text-emerald-500 mr-4" />
										46,53%</td
									> -->
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
								class="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
								type="button">See all</button
							>
						</div>
					</div>
				</div>
				<div class="block w-full overflow-x-auto">
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
