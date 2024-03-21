<script>
	import "../app.postcss";
	import { AppShell, AppBar } from "@skeletonlabs/skeleton";

	/** @type {{user: import('$lib/models').User}} */
	export let data;
</script>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<h2 class="h2">List Maker</h2>
			</svelte:fragment>

			<svelte:fragment slot="trail">
				{#if data.user?.username}
					<a href="/">Home</a>
					<!-- <a href="/account">Account</a> -->
					<a href="/logout">Logout</a>
				{:else}
					<a href="/login">Login</a>
				{/if}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<div class="my-6 m-auto md:w-2/3 w-full">
		<slot />
	</div>
</AppShell>
