<script>
	import { enhance } from "$app/forms";
	import { error_text } from "$lib/styles";

	let msg = "";
</script>

<section class="w-full text-token p-4 space-y-4 card">
	<form
		id="sign-up"
		action="/sign-up"
		method="POST"
		class="space-y-4"
		use:enhance={() => {
			return ({ result, update }) => {
				// @ts-ignore
				msg = result?.data?.msg || "";
				return update();
			};
		}}
	>
		<label for="username" class="label">
			<span>Username</span>
			<input
				class="input"
				class:input-error={msg && true}
				type="text"
				id="username"
				name="username"
			/>
			{#if msg}
				<span class={error_text}>{msg}</span>
			{/if}
		</label>
		<label for="password" class="label">
			<span>Password</span>
			<input
				class="input"
				type="password"
				id="password"
				name="password"
			/>
		</label>

		<div class="flex justify-end space-x-4">
			<button
				class="btn variant-filled-primary"
				type="submit"
				form="sign-up"
			>
				Sign up
			</button>
		</div>
	</form>
</section>
