/**
 * @typedef {Object} User
 *
 * @property {number} userId
 * @property {string} username
 */

/**
 * @typedef {Object} Session
 *
 * @property {string} sessionId
 * @property {number} userId
 */

/**
 * @typedef {Object} List
 * 
 * @property {number} listId
 * @property {string} title
 * @property {number} userId
 */

/** 
 * @param {import("@libsql/client").Row} row 
 * @returns {List}
 */
export function ListFromRow(row) {

	return {
		listId: /** @type {number} */ (row.list_id),
		title: /** @type {string} */ (row.title),
		userId: /** @type {number} */ (row.user_id),
	}
}


/**
 * @typedef {Object} Item
 *
 * @property {number} itemId
 * @property {number} listId
 * @property {string} title
 * @property {number} userId
 */

/** 
 * @param {import("@libsql/client").Row} row 
 * @returns {Item}
 */
export function ItemFromRow(row) {
	return {
		itemId: /** @type {number} */ (row.item_id),
		title: /** @type {string} */ (row.title),
		listId: /** @type {number} */ (row.list_id),
		userId: /** @type {number} */ (row.user_id),
	}
}

export default {};

