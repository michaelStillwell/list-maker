import { executeTurso, getTursoRows, sql } from "./db";
import { ItemFromRow } from "$lib/models";
import Option from "$lib/option";

/**
 * @param {number} userId
 * @param {number} listId
 * @returns {Promise<import("$lib/models").Item[]>}
 */
export async function get_items(userId, listId) {
	const itemRows = await getTursoRows(sql(`
		SELECT item_id, title, list_id, user_id FROM items 
			WHERE user_id =? AND list_id =? 
			ORDER BY item_id ASC;
	`), userId, listId);
	if (itemRows.isNone()) {
		return [];
	}

	const items = itemRows.unwrap().map(ItemFromRow);
	return items;
}

/**
 * @param {number} userId 
 * @param {number} listId 
 * @param {string} title 
 * @returns {Promise<Option<import("$lib/models").Item>>}
 */
export async function create_item(userId, listId, title) {
	const res = await executeTurso(sql(`
		INSERT INTO items (title, list_id, user_id) VALUES (?, ?, ?);
	`), title, listId, userId);

	try {
		const item = {
			itemId: Number(res.unwrap().lastInsertRowid),
			title,
			userId,
			listId
		};
		return Option.some(item);
	} catch {
		return Option.none();
	}
}

/**
 * @param {number} userId
 * @param {number} itemId
 * @param {string} title
 * @returns {Promise<boolean>}
 */
export async function edit_item(userId, itemId, title) {
	const res = await executeTurso(sql(`
		UPDATE items SET title=? WHERE item_id =? AND user_id =?;
	`), title, itemId, userId);

	return res.isSome() && res.unwrap().rowsAffected > 0;
}

/**
 * @param {number} userId
 * @param {number} itemId
 * @returns {Promise<boolean>}
 */
export async function remove_item(userId, itemId) {
	const res = await executeTurso(sql(`
		DELETE FROM items WHERE item_id =? AND user_id =?
	`), itemId, userId);

	return res.isSome() && res.unwrap().rowsAffected > 0;
}
