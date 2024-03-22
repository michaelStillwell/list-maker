import { create_list, edit_list, get_lists, remove_list } from "$lib/db/list";
import { getUser } from "$lib/utils";

/**
 * @typedef IndexData
 * @property {import("$lib/models").List[]} lists
 */

/**
 * @param {*} args
 * @returns {Promise<IndexData>}
 */
export async function load({ cookies }) {
	const user = await getUser(cookies);
	if (user.isNone()) {
		return { lists: [] };
	}

	const lists = await get_lists(user.unwrap().userId);
	return {
		lists,
	};
}

/** @type {import('./$types').Actions} */
export const actions = {
	/** @returns {Promise<{status: number, isDuplicate: boolean}>} */
	add: async ({ request, cookies }) => {
		const user = await getUser(cookies);
		if (user.isNone()) {
			return {
				status: 400,
				isDuplicate: false
			}
		}

		const data = Object.fromEntries(await request.formData());
		const { title } = data;
		if (!title) {
			return {
				status: 400,
				isDuplicate: false
			}
		}

		const { userId } = user.unwrap();
		const list = await create_list(userId, title.toString());
		const isDuplicate = list.isNone();
		return {
			status: !isDuplicate ? 200 : 400,
			isDuplicate
		}
	},

	/** @returns {Promise<{status: number, isDuplicate: boolean, title: string}>} */
	edit: async ({ request, cookies }) => {
		const user = await getUser(cookies);
		if (user.isNone()) {
			return {
				status: 400,
				isDuplicate: false,
				title: ""
			}
		}

		const data = Object.fromEntries(await request.formData());
		const { title, listId } = data;
		if (!title || !listId) {
			return {
				status: 400,
				isDuplicate: false,
				title: title.toString()
			}
		}

		const { userId } = user.unwrap();
		const success = await edit_list(userId, Number(listId), title.toString());
		return {
			status: success ? 200 : 400,
			isDuplicate: !success,
			title: title.toString()
		}
	},

	remove: async ({ request, cookies }) => {
		const user = await getUser(cookies);
		if (user.isNone()) {
			return { status: 400 };
		}

		const data = Object.fromEntries(await request.formData());
		const listId = Number(data.listId);
		if (!listId) {
			return { status: 400 };
		}

		const { userId } = user.unwrap();
		const success = await remove_list(userId, listId);
		return {
			status: success ? 200 : 400
		}
	}
};
