import { executeTurso, getTursoRow, getTursoRows, sql } from "./db";
import { ListFromRow } from "$lib/models";
import Option from "$lib/option";

/**
 * @param {number} userId
 * @param {number} listId
 * @returns {Promise<Option<import("$lib/models").List>>}
 */
export async function get_list(userId, listId) {
	const listRow = await getTursoRow(sql(`
		SELECT list_id, title, user_id FROM lists WHERE user_id =? AND list_id =?
	`), userId, listId);
	if (listRow.isNone()) {
		return Option.none();
	}

	const list = ListFromRow(/** @type {import("@libsql/client").Row} */
		(listRow.unwrap()));
	return Option.some(list);
}

/**
 * @param {number} userId
 * @returns {Promise<import("$lib/models").List[]>}
 */
export async function get_lists(userId) {
	const listRows = await getTursoRows(sql(`
		SELECT list_id, title, user_id FROM lists WHERE user_id =? ORDER BY list_id ASC;
	`), userId);
	const lists = listRows.unwrap().map(ListFromRow);
	return lists;
}

/**
 * @param {number} userId 
 * @param {string} title 
 * @returns {Promise<Option<import("$lib/models").List>>}
 */
export async function create_list(userId, title) {
	const newListRow = await getTursoRow(sql(`
		INSERT INTO lists (user_id, title) VALUES (?, ?) RETURNING list_id;
	`), userId, title);
	try {
		const { list_id } = /** @type {{list_id: number}} */
			(newListRow.unwrap());
		const list = {
			listId: list_id,
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
 * @returns {Promise<boolean>}
 */
export async function edit_list(userId, listId, title) {
	const res = await executeTurso(sql(`
		UPDATE lists SET title=? WHERE user_id =? AND list_id =?;
	`), title, userId, listId);
	if (res.isNone()) {
		return false;
	}

	return res.unwrap().rowsAffected > 0;
}

/**
 * @param {number} userId
 * @param {number} listId
 * @returns {Promise<boolean>}
 */
export async function remove_list(userId, listId) {
	const res = await executeTurso(sql(`
		DELETE FROM lists WHERE user_id =? AND list_id =?;
	`), userId, listId);
	if (res.isNone()) {
		return false;
	}

	return res.unwrap().rowsAffected > 0;
}
