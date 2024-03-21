import { allRows, db, getRow, sql } from "./db";
import Option from "../option";
import { ListFromRow } from "$lib/models";

/**
 * @param {number} userId
 * @param {number} listId
 * @returns {Option<import("$lib/models").List>}
 */
export function get_list(userId, listId) {
	const query = sql(`
		SELECT list_id, title, user_id FROM lists WHERE user_id =? AND list_id =?
	`);
	const statment = db.prepare(query);
	const row = getRow(statment, userId, listId);
	if (row.isNone()) {
		return Option.none();
	}

	const list = ListFromRow(row.unwrap());
	return Option.some(list);
}

/**
 * @param {number} userId
 * @returns {import("$lib/models").List[]}
 */
export function get_lists(userId) {
	const query = sql(`
		SELECT list_id, title, user_id FROM lists WHERE user_id =? ORDER BY list_id ASC;
	`);
	const statment = db.prepare(query);
	const rows = allRows(statment, userId);
	const lists = rows.unwrap().map(ListFromRow);
	return lists;
}

/**
 * @param {number} userId 
 * @param {string} title 
 * @returns {Option<import("$lib/models").List>}
 */
export function create_list(userId, title) {
	const query = sql(`
		INSERT INTO lists (user_id, title) VALUES (?, ?);
	`);
	const statement = db.prepare(query);
	try {
		const res = statement.run(userId, title);

		const list = {
			listId: Number(res.lastInsertRowid),
			title,
			userId
		};
		return Option.some(list);
	} catch (e) {
		return Option.none();
	}
}

/**
 * @param {number} userId 
 * @param {number} listId 
 * @param {string} title 
 * @returns {boolean}
 */
export function edit_list(userId, listId, title) {
	const query = sql(`
		UPDATE lists SET title=? WHERE user_id =? AND list_id =?;
	`);
	const statement = db.prepare(query);
	const res = statement.run(title, userId, listId);
	return res.changes > 0;
}

/**
 * @param {number} userId
 * @param {number} listId
 * @returns {boolean}
 */
export function remove_list(userId, listId) {
	const query = sql(`
		DELETE FROM lists WHERE user_id =? AND list_id =?;
	`);
	const statement = db.prepare(query);
	const res = statement.run(userId, listId);
	return res.changes > 0;
}
