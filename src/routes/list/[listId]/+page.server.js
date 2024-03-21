import { create_item, get_items, edit_item, remove_item } from '$lib/db/item';
import { get_list } from '$lib/db/list'
import { getUser } from '$lib/utils';
import { fail } from '@sveltejs/kit';

/** @type { import('./$types').PageServerLoad } */
export function load({ cookies, params }) {
	const user = getUser(cookies);
	if (user.isNone()) {
		return { items: [], list: [] };
	}

	const { userId } = user.unwrap();
	const list = get_list(userId, parseInt(params.listId));
	if (list.isNone()) {
		return { items: [], list: [] };
	}

	const { listId } = list.unwrap();
	const items = get_items(userId, listId);

	return {
		items,
		list: list.unwrap(),
	};
}

/** @type {import('./$types').Actions} */
export const actions = {
	add: async ({ params, request, cookies }) => {
		const user = getUser(cookies);
		if (user.isNone()) {
			return fail(500, {
				isDuplicate: false,
				title: "",
			});
		}

		const data = Object.fromEntries(await request.formData());
		const { title } = data;
		const { listId } = params;
		if (!title || !listId) {
			return fail(422, {
				isDuplicate: false,
				title: title.toString()
			});
		}

		const { userId } = user.unwrap();
		const item = create_item(userId, Number(listId), title.toString());
		const isDuplicate = item.isNone();
		return isDuplicate ? fail(422, {
			isDuplicate,
			title: title.toString()
		}) : {
			isDuplicate,
		};
	},

	edit: async ({ request, cookies }) => {
		const user = getUser(cookies);
		if (user.isNone()) {
			return fail(400, {});
		}

		const data = Object.fromEntries(await request.formData());
		const { title, itemId } = data;
		if (!title || !itemId) {
			return fail(400, {});
		}

		const { userId } = user.unwrap();
		const success = edit_item(userId, Number(itemId), title.toString());
		return success ? { title } : fail(422, {});
	},

	remove: async ({ request, cookies }) => {
		const user = getUser(cookies);
		if (user.isNone()) {
			return { status: 400 };
		}

		const data = Object.fromEntries(await request.formData());
		const itemId = Number(data.itemId);
		if (!itemId) {
			return { status: 400 };
		}

		const { userId } = user.unwrap();
		const success = remove_item(userId, Number(itemId));
		return {
			status: success ? 200 : 400
		};
	}
}
