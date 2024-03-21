<script>
	import Icon from "@iconify/svelte";
	import { enhance } from "$app/forms";
	import Option from "$lib/option";
	import { error_text } from "$lib/styles";

	/** @type {{items: import("$lib/models.js").Item[], list: import('$lib/models.js').List}} */
	export let data;
	/** @type {{isDuplicate: boolean, title: string}} */
	export let form;

	/** @type {Option<number>} */
	let editing = Option.none();

	/** @param {number?} index */
	function toggle(index = null) {
		if (index !== null && index >= 0) {
			editing = Option.some(index);
		} else {
			editing = Option.none();
		}
	}

	/** @type {import("./$types").SubmitFunction} */
	function check({ cancel }) {
		if (confirm("Are you sure you want to delete?")) {
			return async ({ update }) => {
				return update();
			};
		}

		cancel();
	}
</script>

<section class="w-full text-token card p-4 space-y-4">
	<p class="font-bold">{data.list.title}</p>

	<form
		action="?/add"
		method="POST"
		use:enhance={(e) => {
			e.formElement.autofocus = true;
		}}
	>
		<div class="input-group input-group-divider grid-cols-[1fr_auto]">
			<input
				class="input"
				type="text"
				name="title"
				value={form?.title || ""}
				placeholder="Title..."
			/>
			<button class="btn variant-filled-secondary">+</button>
		</div>
		{#if form?.isDuplicate}
			<p class={error_text}>Title already exists</p>
		{/if}
	</form>

	<ul class="list">
		{#each data.items as item, index}
			{#if editing.isSome() && index === editing.unwrap()}
				<li class="px-3 pl-0">
					<!-- svelte-ignore a11y-autofocus -->
					<form
						id="edit"
						action="?/edit"
						class="flex-auto flex justify-between items-center"
						method="POST"
						use:enhance={() => {
							return async ({ result }) => {
								// @ts-ignore
								item.title = result.data.title;
								toggle();
							};
						}}
					>
						<input
							name="itemId"
							type="hidden"
							value={item.itemId}
						/>

						<input
							name="title"
							type="text"
							class="input flex-1 border-0 m-0"
							value={item.title}
							autofocus
						/>

						<span>
							<button
								class="btn-icon text-primary-500"
								type="submit"
								form="edit"
							>
								<Icon icon="mdi:check" />
							</button>
							<button
								class="btn-icon text-warning-500"
								type="submit"
								on:click|preventDefault={() => toggle()}
							>
								<Icon icon="mdi:cancel" />
							</button>
						</span>
					</form>
				</li>
			{:else}
				<li class="px-3">
					<span class="flex-auto flex justify-between items-center">
						<form
							id={`remove-item-${item.itemId}`}
							class="hidden"
							action="?/remove"
							method="POST"
							use:enhance={check}
						>
							<input
								name="itemId"
								type="text"
								value={item.itemId}
							/>
						</form>

						<p>{item.title}</p>
						<span>
							<button
								class="btn-icon"
								on:click={() => toggle(index)}
							>
								<Icon icon="mdi:edit" />
							</button>
							<button
								class="btn-icon text-error-500"
								form={`remove-item-${item.itemId}`}
							>
								<Icon icon="mdi:trash" />
							</button>
						</span>
					</span>
				</li>
			{/if}
		{/each}
	</ul>
</section>
