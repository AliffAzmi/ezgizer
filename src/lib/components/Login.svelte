<script>
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { page } from '$app/stores';

	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

	const errors = {
		AccessDenied: 'You do not have permission to sign in.',
		Signin: 'Try signing with a different account.',
		OAuthSignin: 'Try signing with a different account.',
		OAuthCallback: 'Try signing with a different account.',
		OAuthCreateAccount: 'Try signing with a different account.',
		EmailCreateAccount: 'Try signing with a different account.',
		Callback: 'Try signing with a different account.',
		OAuthAccountNotLinked:
			'To confirm your identity, sign in with the same account you used originally.',
		EmailSignin: 'Check your email address.',
		CredentialsSignin: 'Sign in failed. Check the details you provided are correct.',
		default: 'Unable to sign in.'
	};

	const errorType = $page.url.searchParams.get('error');
	let errorMessage;

	onMount(() => {
		if (errorType) {
			errorMessage = errors[errorType];
		}
	});
</script>

<svelte:head>
	<title>Login | Ezgizer</title>
</svelte:head>

<div
	class="bg-cover bg-center bg-no-repeat min-h-screen min-w-screen flex flex-col md:flex-row blur-[3px]"
	style="background-image: url('/images/ezgizer-bg-cover.jpg');"
/>
<div class=" w-full h-screen justify-center items-center flex absolute top-0">
	<div class="w-full lg:w-4/12 px-4">
		<div
			class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0"
		>
			<div class="rounded-t mb-0 px-6 py-6">
				<div class="text-center mb-3">
					<h6 class="text-gray-500 text-sm font-bold">Sign in with</h6>
				</div>
				<div class="btn-wrapper text-center flex justify-center">
					{#if Object.keys($page.data.session || {}).length}
						{#if $page.data.session.user.image}
							<span
								style="background-image: url('{$page.data.session.user.image}')"
								class="avatar"
							/>
						{/if}
						<span class="signedInText">
							<small>Signed in as</small><br />
							<strong>{$page.data.session.user.email || $page.data.session.user.name}</strong>
						</span>
						<button on:click={() => signOut()} class="button">Sign out</button>
					{:else}
						<button
							on:click={() => signIn('google')}
							class="flex items-center justify-center text-white rounded-lg shadow bg-white hover:bg-gray-100"
						>
							<div class="px-4 py-3">
								<Icon class="h-6 w-6" icon="flat-color-icons:google" />
							</div>
							<h1 class="px-4 py-3 w-5/6 text-center text-gray-600 font-bold">Google</h1>
						</button>
					{/if}
				</div>
				<div class=" flex items-center justify-center mt-4">
					{#if errorMessage}
						<p class=" text-red-500 text-xs">{errorMessage}</p>
					{/if}
				</div>
				<hr class="mt-6 border-b-1 border-gray-300" />
			</div>
			<div class="flex-auto px-4 lg:px-10 py-10 pt-0">
				<div class="text-gray-400 text-center mb-3 font-bold">
					<small>Or sign in with credentials</small>
				</div>
				<form>
					<div class="relative w-full mb-3">
						<label class="block uppercase text-gray-600 text-xs font-bold mb-2" for="grid-email"
							>Email</label
						>
						<input
							id="grid-email"
							type="email"
							class="border-0 px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
							placeholder="Email"
						/>
					</div>

					<div class="relative w-full mb-3">
						<label class="block uppercase text-gray-600 text-xs font-bold mb-2" for="grid-password"
							>Password</label
						>
						<input
							id="grid-password"
							type="password"
							class="border-0 px-3 py-3 placeholder-gray-300 text-gray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
							placeholder="Password"
						/>
					</div>
					<div>
						<label class="inline-flex items-center cursor-pointer"
							><input
								id="customCheckLogin"
								type="checkbox"
								class="form-checkbox border-0 rounded text-gray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
							/>
							<span class="ml-2 text-sm font-semibold text-gray-600">Remember me</span></label
						>
					</div>

					<div class="text-center mt-6">
						<button
							class="bg-gray-800 text-white active:bg-gray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
							type="button">Sign In</button
						>
					</div>
				</form>
			</div>
		</div>
		<div class="flex flex-wrap mt-6 relative">
			<div class="w-1/2">
				<a href="#pablo" class="text-gray-200"><small>Forgot password?</small></a>
			</div>
			<div class="w-1/2 text-right">
				<a href="/notus-svelte/auth/register" class="text-gray-200"
					><small>Create new account</small></a
				>
			</div>
		</div>
	</div>
</div>
