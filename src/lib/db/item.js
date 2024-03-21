import { ItemFromRow } from "$lib/models";
import { allRows, db, sql } from "./db";
import Option from "$lib/option";

/**
 * @param {number} userId
 * @param {number} listId
 * @returns {import("$lib/models").Item[]}
 */
export function get_items(userId, listId) {
	const query = sql(`
		SELECT item_id, title, list_id, user_id FROM items 
			WHERE user_id =? AND list_id =? 
			ORDER BY item_id ASC;
	`);
	const statment = db.prepare(query);
	const rows = allRows(statment, userId, listId);
	if (rows.isNone()) {
		return [];
	}

	const items = rows.unwrap().map(ItemFromRow);
	return items;
}

/**
 * @param {number} userId 
 * @param {number} listId 
 * @param {string} title 
 * @returns {Option<import("$lib/models").Item>}
 */
export function create_item(userId, listId, title) {
	const query = sql(`
		INSERT INTO items (title, list_id, user_id) VALUES (?, ?, ?);
	`);

	const statment = db.prepare(query);
	try {
		const res = statment.run(title, listId, userId);
		const item = {
			itemId: Number(res.lastInsertRowid),
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
 * @returns {boolean}
 */
export function edit_item(userId, itemId, title) {
	const query = sql(`
		UPDATE items SET title=? WHERE item_id =? AND user_id =?;
	`);

	const statment = db.prepare(query);
	const res = statment.run(title, itemId, userId);
	return res.changes > 0;
}

/**
 * @param {number} userId
 * @param {number} itemId
 * @returns {boolean}
 */
export function remove_item(userId, itemId) {
	const query = sql(`
		DELETE FROM items WHERE item_id =? AND user_id =?
	`);
	const statment = db.prepare(query);
	const res = statment.run(itemId, userId);
	return res.changes > 0;
}
