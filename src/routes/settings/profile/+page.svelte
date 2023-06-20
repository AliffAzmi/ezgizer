<script>
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { invalidate, invalidateAll } from '$app/navigation';
	import toast, { Toaster } from 'svelte-french-toast';

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
	<h3 class=" text-lg font-bold">My Profile</h3>

	<!-- Name -->
	<div class=" my-4 p-4 dark:bg-slate-700 dark:border-gray-700 rounded border-2">
		<form method="POST" use:enhance={handleSubmit}>
			<input type="hidden" name="id" value={data?.user.id} />
			<div class=" flex flex-row-reverse">
				<button type="submit" class="submit">Save</button>
			</div>
			<div class=" grid grid-cols-3">
				<div class=" flex gap-4 items-center col-span-3 lg:col-span-2">
					<img
						alt="..."
						class="w-20 rounded-full align-middle border-none shadow-lg"
						src={data?.user?.image || 'http://source.unsplash.com/800x800/?tree'}
					/>
					<div class="flex-grow">
						<label>
							Name
							<input name="name" type="text" class="w-full" value={data?.user.name} />
						</label>
					</div>
				</div>
			</div>
		</form>
	</div>

	<!-- Info -->
	<div class=" my-4 p-4 dark:bg-slate-700 dark:border-gray-700 rounded border-2">
		<form method="POST" use:enhance={handleSubmit}>
			<input type="hidden" name="id" value={data?.user.id} />
			<div class="grid grid-cols-3 py-3">
				<h5 class=" text-md col-span-2">Personal Information</h5>
				<div class=" text-end">
					<button type="submit" class="submit">Save</button>
				</div>
			</div>

			<div class="grid md:grid-cols-3 lg:grid-cols-3 gap-4 py-3">
				<label>
					<div>Email Address</div>
					<input type="text" class=" w-full" value={data?.user.email} readonly />
				</label>
				<label>
					<div>Phone</div>
					<input type="text" class=" w-full" name="phone" value={data?.user.phone || '+012 2'} />
				</label>
			</div>
			<div class="grid md:grid-cols-3 lg:grid-cols-3 py-3">
				<label class=" col-span-2">
					<div>Occupation</div>
					<input
						type="text"
						class=" w-full"
						name="occupation"
						value={data?.user.occupation || ''}
					/>
				</label>
			</div>
		</form>
	</div>

	<!-- Address -->
	<div class=" my-4 p-4 dark:bg-slate-700 dark:border-gray-700 rounded border-2">
		<form method="POST" use:enhance={handleSubmit}>
			<input type="hidden" name="id" value={data?.user.id} />
			<div class="grid grid-cols-3 py-3">
				<h5 class=" text-md col-span-2">Address</h5>
				<div class=" text-end"><button type="submit" class="submit">Save</button></div>
			</div>

			<div class="grid md:grid-cols-3 lg:grid-cols-3 gap-4 py-3">
				<label>
					<div>Country</div>
					<input type="text" class=" w-full" name="country" value={data?.user.country || ''} />
				</label>
				<label>
					<div>State</div>
					<input type="text" class=" w-full" name="state" value={data?.user?.state || ''} />
				</label>
			</div>
			<div class="grid md:grid-cols-3 lg:grid-cols-3 gap-4 py-3">
				<label>
					<div>Postal Code</div>
					<input type="text" class=" w-full" name="postcode" value={data?.user?.postcode || ''} />
				</label>
				<label>
					<div>TAX ID</div>
					<input type="text" class=" w-full" name="tax_id" value={data?.user?.tax_id || ''} />
				</label>
			</div>
		</form>
	</div>
</div>
