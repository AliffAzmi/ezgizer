<script>
	import { Pie } from 'svelte-chartjs';
	import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';
	import { onMount } from 'svelte';

	export let data;
	let mount = false;
	let config;
	let active = 'price';
	let label = 'RM ';
	$: labels = data.length ? data.map((item) => item.name) : [];
	$: payload = data.length ? data.map((item) => item.price) : [];

	onMount(async () => {
		if (data) {
			await ChartJS.register(Title, Tooltip, ArcElement, CategoryScale);
			mount = true;
		}
	});

	$: config = {
		labels: labels,
		datasets: [
			{
				label: label,
				data: payload,
				backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360', '#AC64AD'],
				hoverBackgroundColor: ['#FF5A5E', '#5AD3D1', '#FFC870', '#A8B3C5', '#616774', '#DA92DB'],
				borderWidth: 3
			}
		]
	};

	const handleCategoryType = async (type) => {
		active = type;
		if (type === 'price') {
			payload = data.map((item) => item.price);
			label = 'RM';
		} else {
			payload = data.map((item) => item.txns);
			label = 'No. of Transactions';
		}
	};
</script>

{#if mount && config && data.length}
	<div>
		<div class=" w-full">
			<Pie data={config} options={{ responsive: true }} />
		</div>
		<div class=" flex align-middle justify-center gap-1 my-2 font-bold">
			<button
				on:click={() => handleCategoryType('price')}
				class:active={active === 'price'}
				class="button-xs">PRICE</button
			>
			<button
				on:click={() => handleCategoryType('txns')}
				class:active={active === 'txns'}
				class="button-xs">TRANSACTION</button
			>
		</div>
	</div>
{/if}

<style>
	.active {
		@apply bg-red-500 hover:bg-red-700 text-white;
	}
	.button-xs {
		@apply p-2 border border-red-200 rounded text-xs;
	}
</style>
