<script>
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import toast, { Toaster } from 'svelte-french-toast';
	import { convertCurrency } from '$lib/utils';
	export let data;

	const handleSubmit = ({ form, data, action, cancel, submitter }) => {
		return async ({ result, update }) => {
			const { data } = result;
			if (data.success) {
				await invalidateAll();
				toast.success(data?.message);
			} else {
				toast.error(data?.message || 'Something went wrong');
			}
		};
	};
</script>

<Toaster />
<div>
	<h3 class=" text-lg font-bold">General</h3>

	<div class=" my-4 p-4 dark:bg-slate-700 dark:border-gray-700 rounded border-2">
		<form method="POST" use:enhance={handleSubmit}>
			<div class=" text-end">
				<button type="submit" class="submit">Save</button>
			</div>

			<div class=" w-full md:w-2/4 lg:w-2/4">
				<input type="hidden" name="id" value={data?.user.id} />
				<div class=" py-2">
					<label>
						<div>Income</div>
						<div class=" flex items-center gap-2 bg-gray-200 dark:bg-slate-600">
							<span class=" text-sm pl-2 uppercase"
								>{convertCurrency(data?.setting?.currency) || 'RM'}</span
							>
							<input type="number" class=" w-full" name="income" value={data?.user.income} />
						</div>
					</label>
				</div>

				<div class=" py-2">
					<label>
						<div>Currency</div>
						<div class="relative">
							<select name="currency">
								<option value="myr" selected={data?.setting?.currency === 'myr' && true}>RM</option>
								<option value="usd" selected={data?.setting?.currency === 'usd' && true}>USD</option
								>
								<option value="eur" selected={data?.setting?.currency === 'eur' && true}>EUR</option
								>
							</select>
							<div
								class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-white"
							>
								<svg
									class="fill-current h-4 w-4"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
								>
									<path
										d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
									/>
								</svg>
							</div>
						</div>
					</label>
				</div>
				<div class=" py-2">
					<span> Plan </span>
					<div>
						<!-- svelte-ignore a11y-invalid-attribute -->
						Your current plan is FREE.
						<a href="#" class=" font-bold text-blue-400 hover:text-blue-700">Upgrade</a>
					</div>
				</div>
			</div>
		</form>
	</div>
</div>
