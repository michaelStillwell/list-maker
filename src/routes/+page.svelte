<script>
	import { enhance } from "$app/forms";
	import Option from "$lib/option.js";
	import { error_text } from "$lib/styles";
	import Icon from "@iconify/svelte";

	/**
	 * @type {{lists: import("$lib/models").List[]}}
	 */
	export let data;
	export let form;

	/** @type {Option<number>} */
	let editing = Option.none();

	/** @param {number?} listId */
	function toggle(listId = null) {
		if (editing.isNone() && listId !== null) {
			editing = Option.some(listId);
		} else if (listId !== null) {
			editing = Option.some(listId);
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

{JSON.stringify(data)}
<section class="w-full text-token p-4 space-y-4 card">
	<p class="font-bold">Your lists</p>

	<form
		action="?/add"
		method="POST"
		use:enhance={(e) => {
			e.formElement.autofocus = true;
		}}
	>
		<div class="input-group input-group-divider grid-cols-[1fr_auto]">
			<input type="text" name="title" placeholder="Title..." />
			<button class="btn variant-filled-secondary">
				<Icon icon="mdi:plus" />
			</button>
		</div>
		{#if form?.isDuplicate}
			<p class={error_text}>Title already exists</p>
		{/if}
	</form>

	<ul class="list">
		{#each data.lists as list, index}
			{#if editing.isSome() && index === editing.unwrap()}
				<li class="px-3 pl-0">
					<!-- svelte-ignore a11y-autofocus -->
					<form
						id="edit"
						action="?/edit"
						class="flex-auto flex justify-between lists-center"
						method="POST"
						use:enhance={() => {
							return async ({ result }) => {
								// @ts-ignore
								list.title = result.data.title;
								toggle();
							};
						}}
					>
						<input
							name="listId"
							type="hidden"
							value={list.listId}
						/>

						<input
							name="title"
							type="text"
							class="input flex-1 border-0 m-0"
							value={list.title}
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
							id={`remove-list-${list.listId}`}
							class="hidden"
							action="?/remove"
							method="POST"
							use:enhance={check}
						>
							<input
								name="listId"
								type="text"
								value={list.listId}
							/>
						</form>

						<a href={`/list/${list.listId}`}>{list.title}</a>
						<span>
							<button
								class="btn-icon"
								on:click={() => toggle(index)}
							>
								<Icon icon="mdi:edit" />
							</button>
							<button
								class="btn-icon text-error-500"
								form={`remove-list-${list.listId}`}
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
