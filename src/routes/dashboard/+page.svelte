<script>
	import { onMount } from 'svelte';
	// import { page } from '$app/stores';
	import Top from '$lib/components/Top.svelte';
	import Icon from '@iconify/svelte';

	let income = 0;
	let pendingFigure = 0;
	let spentFigure = 0;
	let performanceFigure = '0%';
	onMount(async () => {
		const { id } = await getUsers();
		const { pending, spent, performance } = await getOverallReports(id);
		pendingFigure = new Intl.NumberFormat('ta-MY', { style: 'currency', currency: 'MYR' }).format(
			pending
		);
		spentFigure = new Intl.NumberFormat('ta-MY', { style: 'currency', currency: 'MYR' }).format(
			spent
		);
		performanceFigure = performance;
	});

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
		income = user.income
			? new Intl.NumberFormat('ta-MY', { style: 'currency', currency: 'MYR' }).format(user.income)
			: 0 || 0;
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
									<h5 class="text-gray-400 uppercase font-bold text-xs">INCOME</h5>
									<span class="font-semibold text-xl text-gray-700">{income}</span>
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
								<span class="whitespace-nowrap">Higher</span>
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
									<span class="font-semibold text-xl text-gray-700">{performanceFigure}</span>
								</div>
								<div class="relative w-auto pl-4 flex-initial">
									<div
										class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-emerald-500"
									>
										<Icon class=" w-6 h-6" icon="mdi:performance" />
									</div>
								</div>
							</div>
							<p class="text-sm text-gray-400 mt-4">
								<span class="mr-2 text-emerald-500"><i class="fas fa-arrow-up" /> 12%</span>
								<span class="whitespace-nowrap">Since last month</span>
							</p>
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
						<div class="relative w-full px-4 max-w-full flex-grow flex-1">
							<h3 class="font-semibold text-base text-gray-700">Page visits</h3>
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
						<thead
							><tr
								><th
									class="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
									>Page name</th
								>
								<th
									class="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
									>Visitors</th
								>
								<th
									class="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
									>Unique users</th
								>
								<th
									class="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
									>Bounce rate</th
								></tr
							></thead
						>
						<tbody
							><tr
								><th
									class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left"
									>/argon/</th
								>
								<td
									class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
									>4,569</td
								>
								<td
									class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
									>340</td
								>
								<td
									class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
									><i class="fas fa-arrow-up text-emerald-500 mr-4" />
									46,53%</td
								></tr
							>
							<tr
								><th
									class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left"
									>/argon/index.html</th
								>
								<td
									class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
									>3,985</td
								>
								<td
									class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
									>319</td
								>
								<td
									class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
									><i class="fas fa-arrow-down text-orange-500 mr-4" />
									46,53%</td
								></tr
							>
							<tr
								><th
									class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left"
									>/argon/charts.html</th
								>
								<td
									class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
									>3,513</td
								>
								<td
									class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
									>294</td
								>
								<td
									class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
									><i class="fas fa-arrow-down text-orange-500 mr-4" />
									36,49%</td
								></tr
							>
							<tr
								><th
									class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left"
									>/argon/tables.html</th
								>
								<td
									class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
									>2,050</td
								>
								<td
									class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
									>147</td
								>
								<td
									class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
									><i class="fas fa-arrow-up text-emerald-500 mr-4" />
									50,87%</td
								></tr
							>
							<tr
								><th
									class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left"
									>/argon/profile.html</th
								>
								<td
									class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
									>1,795</td
								>
								<td
									class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
									>190</td
								>
								<td
									class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
									><i class="fas fa-arrow-down text-red-500 mr-4" />
									46,53%</td
								></tr
							></tbody
						>
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
						<div class="relative w-full px-4 max-w-full flex-grow flex-1">
							<h3 class="font-semibold text-base text-gray-700">Social traffic</h3>
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
						<thead class="thead-light"
							><tr
								><th
									class="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
									>Referral</th
								>
								<th
									class="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
									>Visitors</th
								>
								<th
									class="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-140-px"
								/></tr
							></thead
						>
						<tbody
							><tr
								><th
									class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left"
									>Facebook</th
								>
								<td
									class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
									>1,480</td
								>
								<td
									class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
									><div class="flex items-center">
										<span class="mr-2">60%</span>
										<div class="relative w-full">
											<div class="overflow-hidden h-2 text-xs flex rounded bg-red-200">
												<div
													style="width: 60%;"
													class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
												/>
											</div>
										</div>
									</div></td
								></tr
							>
							<tr
								><th
									class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left"
									>Facebook</th
								>
								<td
									class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
									>5,480</td
								>
								<td
									class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
									><div class="flex items-center">
										<span class="mr-2">70%</span>
										<div class="relative w-full">
											<div class="overflow-hidden h-2 text-xs flex rounded bg-emerald-200">
												<div
													style="width: 70%;"
													class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"
												/>
											</div>
										</div>
									</div></td
								></tr
							>
							<tr
								><th
									class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left"
									>Google</th
								>
								<td
									class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
									>4,807</td
								>
								<td
									class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
									><div class="flex items-center">
										<span class="mr-2">80%</span>
										<div class="relative w-full">
											<div class="overflow-hidden h-2 text-xs flex rounded bg-purple-200">
												<div
													style="width: 80%;"
													class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
												/>
											</div>
										</div>
									</div></td
								></tr
							>
							<tr
								><th
									class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left"
									>Instagram</th
								>
								<td
									class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
									>3,678</td
								>
								<td
									class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
									><div class="flex items-center">
										<span class="mr-2">75%</span>
										<div class="relative w-full">
											<div class="overflow-hidden h-2 text-xs flex rounded bg-lightBlue-200">
												<div
													style="width: 75%;"
													class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-lightBlue-500"
												/>
											</div>
										</div>
									</div></td
								></tr
							>
							<tr
								><th
									class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left"
									>twitter</th
								>
								<td
									class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
									>2,645</td
								>
								<td
									class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
									><div class="flex items-center">
										<span class="mr-2">30%</span>
										<div class="relative w-full">
											<div class="overflow-hidden h-2 text-xs flex rounded bg-orange-200">
												<div
													style="width: 30%;"
													class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-orange-500"
												/>
											</div>
										</div>
									</div></td
								></tr
							></tbody
						>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>
